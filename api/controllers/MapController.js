/**
 * Import map
 */


/**
 * MapController
 *
 * @description :: Server-side logic for managing maps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
 	getallmap: function (req, res) {
		// Look up the user record from the database which is
		// referenced by the id in the user session (req.session.me)
		Map.find(function foundMap(err, maps) {
			if (err) return res.negotiate(err);
			return res.json(maps);
		});
	},

	createmap: function (req, res) {
		req.file('map_file_path').upload({		//upload file ảnh lên
			// don't allow the total upload size to exceed ~10MB
			maxBytes: 10000000,
			// Change to custom path
			dirname: require('path').resolve(sails.config.appPath, 'assets/public/map')		//set thư mục lưu ảnh là assets/public/map
		},function whenDone(err, uploadedFiles) {
			if (err) return res.negotiate(err);
			// If no files were uploaded, respond with an error.
			if (uploadedFiles.length === 0){
				return res.badRequest('No file was uploaded');
			}

			var filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('\\')+1);

			Map.create({
				name: req.param('name'),
				width: req.param('width'),
				height: req.param('height'),
				map_file_path: 'assets/public/map/' + filename
			},function mapCreated(err, newMap) {
				if (err) {
					console.log("err: ", err);
					console.log("err.invalidAttributes: ", err.invalidAttributes)

					if (err.invalidAttributes.name[0].rule === 'unique') {
						return res.nameInUse();
					}
					return res.negotiate(err);
				}
				return res.redirect('/');
			});
		});
	},

	getmapsize: function (req, res){
		User.findOne({
			id: req.param('userid')
		}).populate('map').exec(function foundUser(err, user) {
			if (err) return res.negotiate(err);
			if (!user) return res.notFound();
			return res.json({
				id: user.map.id,
				name: user.map.name,
				width: user.map.width,
				height: user.map.height
			});
		});
	},

	getmapfile: function (req,res){
		User.findOne({
			id: req.param('userid')
		}, function foundUser(err, user) {
			if (err) return res.negotiate(err);
			if (!user) return res.notFound();
			if (user.map != null){
				Map.findOne({
					id: user.map
				}, function foundMap(err, map) {
					if (err) return res.negotiate(err);
					if (!map) return res.notFound();
					return res.download(map.map_file_path);
				});
			} else {
				return res.json({'mapfile': 'null'});
			}
		});
	},

	updatecurrentmap: function (req,res){
		Beacon.findOne({
			id: req.param('beacon_id')
		}, function foundBeacon(err, beacon){
			if (err) return res.negotiate(err);
			if (!beacon) return res.notFound();
			var currentMap = beacon.map;
			User.findOne({
				id: req.param('user_id')
			}, function foundUser(err, user){
				if (err) return res.negotiate(err);
				if (!user) return res.notFound();
				user.map = currentMap;
				user.save(function(error){
					if(error){
						console.log('update current map of this user failed!');
					}
				});
				return res.json(currentMap);
			});
		});
	},
	testajax: function(req, res){
		console.log('ajax ok');
		return res.json(200,{
						result: 'thanhcong'
					});
	},
	mindistance: function(req,res){
		var data = req.body;
		let products = [];
		//convert uni-directional to bi-directional graph
		// needs to look like: where: { a: { b: cost of a->b }
		// var graph = {
		//     a: {e:1, b:1, g:3},
		//     b: {a:1, c:1},
		//     c: {b:1, d:1},
		//     d: {c:1, e:1},
		//     e: {d:1, a:1},
		//     f: {g:1, h:1},
		//     g: {a:3, f:1},
		//     h: {f:1}
		// };
		Loaisanpham.find(function foundLoaiSanPham(err, LoaiSanPham)
		{
			// console.log('loai san phammmmmmmmmmmmm', LoaiSanPham);
			LoaiSanPham.forEach(function(Loaisanpham){
				products.push(Loaisanpham);
			});
			User.findOne({
				id: parseInt(req.param('star'))
			},function(err, user){

				if (err) return res.negotiate(err);

				var arrDistance = [];
				products.map(function(product, indexOfProduct){
					arrDistance.push(convertDistance(user,product));
				});
				var min = Math.min(...arrDistance);
				var indexMin = arrDistance.indexOf(min);

				var star = products[indexMin].nodeGraph;

					finish = req.param('finish');
					var solutions = solve(graph, star);
					products.unshift(user);
					return res.json(200,{
						solutions: solutions[finish],
						products: products
					});
			});
			// for(var key in req.body) {
			// console.log(req.body);
			// if(req.body.hasOwnProperty(key)){
					// var array = req.param(key).split(",");
					// star = array[0].split(":")[1];
					// finish = array[1].split(":")[1];
					
					// console.log(graph);
				// }
			// }
			
		});
	}
};

function solve(graph, s,f) {
	var solutions = {};
	solutions[s] = [];
	solutions[s].dist = 0;

	while(true) {
		var parent = null;
		var nearest = null;
		var dist = Infinity;

    //for each existing solution
    for(var n in solutions) {
    	if(!solutions[n])
    		continue
    	var ndist = solutions[n].dist;
    	var adj = graph[n];
      //for each of its adjacent nodes...
      for(var a in adj) {
        //without a solution already...
        if(solutions[a])
        	continue;
        //choose nearest node with lowest *total* cost
        var d = adj[a] + ndist;
        if(d < dist) {
          //reference parent
          parent = solutions[n];
          nearest = a;
          dist = d;
      }
  }
}

    //no more solutions
    if(dist === Infinity) {
    	break;
    }
    
    //extend parent's solution path
    solutions[nearest] = parent.concat(nearest);
    //extend parent's cost
    solutions[nearest].dist = dist;
}

return solutions;
}
var graph = {};

// var layout = {
// 	'A': ['1','2'],
// 	'B': ['3','4','C'],
// 	'C': ['4','B','5','6'],
// 	'D': ['7','E','10','G','8'],
// 	'E': ['9','10','D'],
// 	'F': ['11','12'],
// 	'G': ['13','14','D'],
// 	'H': ['15','16'],
// 	'I': ['17','18','K'],
// 	'K': ['20','18','19','17','I'],
// 	'L': ['24','6','25'],
// 	'M': ['23','24'],
// 	'N': ['21','17','19','22'],
// 	'1': ['A'],
// 	'2': ['4','25'],
// 	'3': ['5','B'],
// 	'4': ['2,C,6,B,25'],
// 	'5': ['3,C'],
// 	'6': ['C','4','L','23'],
// 	'7': ['9','D'],
// 	'8': ['D','14','21','23'],
// 	'9': ['7','E'],
// 	'10': ['E','D','13','12','15'],
// 	'11': ['F'],
// 	'12': ['F','15','10'],
// 	'13': ['10','G'],
// 	'14': ['8','G','17','21'],
// 	'15': ['12','10','H'],
// 	'16': ['H','18','20'],
// 	'17': ['21','14','I','K','19','N'],
// 	'18': ['K','I','20','16'],
// 	'19': ['17 K N 22'],
// 	'20': ['18','16','K'],
// 	'21': ['17','N','14','8','23'],
// 	'22': ['19','N'],
// 	'23': ['24','21','8','6'],
// 	'24': ['M','L'],
// 	'25': ['L','4','2'],
// }
var layout = {
	'a': ['b', 'h', 'i'],
    'b': ['a', 'h', 'i'],
    'c': ['i', 'd', 'f', 'l'],
    'd': ['f', 'c'],
    'e': ['g'],
    'f': ['l', 'c','i'],
    'g': ['e', 'l'],
    'h': ['i','a','b'],
    'i': ['c', 'l', 'b','h','a'],
    'k': ['l','i'],
    'l': ['k','i', 'c','f']
}

for(var id in layout) {
	if(!graph[id])
		graph[id] = {};
	layout[id].forEach(function(aid) {
		graph[id][aid] = 1;
		if(!graph[aid])
			graph[aid] = {};
		graph[aid][id] = 1;
	});
}
function convertDistance(start, finish){
	let distance = 0;
	distance = Math.sqrt(Math.pow((start.posX - finish.posX), 2) + Math.pow((start.posY - finish.posY), 2));
	return distance;
}
function minDistaneBetweenTwoNode(firstNode, secondNode){
}