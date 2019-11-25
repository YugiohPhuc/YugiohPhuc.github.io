//putdistancecollected cũng là 1 atribute của module.export, nên muốn gọi 1 atribute khác trong atribute này ta phải trỏ về lại object để gọi
//cần có this.trilateration() vì hàm này nằm trong module.export (là 1 object), hàm này là 1 atribute của object này
//hoặc nếu ta đặt hàm trilateration ở bên trong object module.export thì ta dùng pos = this.trilateration(data[0].user_id,res);											



/**
 * Distance_collectController
 *
 * @description :: Server-side logic for managing distance_collects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var posDesX = 0;
	posDesY = 0;
	posDesCarry = 0;
	controlMode = 0;
	controlButton = 0;


module.exports = {			//module.exports là 1 object

	posDestination: function (req, res){		
		posDesX = req.param('posDesX');		console.log("posDesX: " + posDesX);
		posDesY = req.param('posDesY');		console.log("posDesY: " + posDesY);
		posDesCarry = 1;	       
	},

	controlByServer: function (req, res){
		controlButton = req.body.controlButton;	console.log("controlButton: " + controlButton)
		// console.log(req)
		// controlStart = req.param('controlStart');	console.log("controlStart: " + controlStart)
		// controlStop = req.body.controlStop;		console.log("controlStop: " + controlStop)
		return res.send("receive")
	},
	 
	chossemodeByServer: function (req, res){
		controlMode = req.param('controlMode');		console.log("controlMode: " + controlMode)
	},


	putdistancecollected: function (req, res){			//nhận distance từ device 
		var data = req.body;
		for(var i = 0; i < 3; i++ ){
			var beacon_id = data[i].beacon_id;  console.log("beacon_id = " + beacon_id);
				user_id = data[i].user_id;      console.log("user_id = " + user_id);
				distance = data[i].distance;            console.log("distance = " + distance);
				updateDistance_collect(beacon_id,user_id,distance);				//update distance vào db
		}
		console.log("id: " + data[0].user_id);
		trilateration(data[0].user_id,res).then(value => {			//những cái trả về sau khi chạy hàm trilateration sẽ được để trong value
			let pos = value;			//pos là 1 object 
			console.log("pos : " + JSON.stringify(pos) )			
			if(pos.notice === 1){									//có distance gửi lên trong 10s			
				return res.json(200, {										
					beacons : pos.beacons,									
					posX 	: pos.posX,					//trả về tọa độ x của user		
					posY    : pos.posY,					//trả về tọa độ y của user
					posDesX : pos.posDesX,				//trả về tọa độ x cần đến
					posDesY : pos.posDesY,				//trả về tọa độ y cần đến
					posDesCarry : pos.posDesCarry,		//trả về cờ báo có tọa độ điểm cần đến nhập vào hay ko
					controlMode : controlMode,
					controlButton : controlButton
				});
			};
			if(pos.notice === 0){				//ko có distance gửi lên hoặc gửi thiếu distance 
				return res.json(200, {						
					distance : pos.distance_collects,
					posX : 0.0,
					posY : 0.0
				});				
			}
		}, 
		 	reason => {			//nếu trả về error thì in cái error ra
				console.log("error : " + reason)
			}
		);														//biến pos để lưu những giá trị được trả về sau khi chạy hàm trilateration	
	},	

};


function trilateration (user_id,res){				//user_id là id của user vừa mới được gửi lên		
	return new Promise((resolve,reject) => {		//dùng PROMISE để xử lý bất đồng bộ --- những hàm bất đồng bộ ta sẽ để hết bên trong hàm này
		User.findOne({									//cái này nó chạy bất đồng bộ
			id: user_id
		}).populate('map').exec(function foundUser(err, user) {
			 console.log("id: " + user_id)
			if (err) return res.negotiate(err);
	
			var now = new Date();
			now.setSeconds(now.getSeconds()-10);
			Distance_collect.find({
				user : user.id
			}).populate('beacon').exec(function(err,distance_collects){
				if(err) reject(err)
				console.log("số distance thu được: " + distance_collects.length)

				if (distance_collects.length>2){
					var beacons = distance_collects.map(function(distance_collect){
						var distance = distanceToDistance(distance_collect.distance, 
							distance_collect.beacon.a_parameter, 
							distance_collect.beacon.n_parameter);
							console.log("distance = " + distance)					//distance này tính ok rồi nha
						return {										//sau lệnh return này thì trong array beacons = [distance, posX, posY]
							'distance':distance,						//khoảng cách giữa xe vs beacon	
							'posX':distance_collect.beacon.posX,			//tọa độ x của beacon
							'posY':distance_collect.beacon.posY				//tọa độ y của beacon
						};
					});						//sau lệnh return ở trên thì trong array beacons = [distance, posX, posY]
					console.log("beacons: ");
					console.log(beacons);
					var pos = leastSquareSolution(beacons);		//dùng phương pháp Least squares (Bình phương tối thiểu) để xác định tọa độ
						posFit = fitMapTrilateration(pos,user.map.width,user.map.height);			//định vị cho AGV trên bản đồ dùng trilateration 
						posX = posFit.posX1num;			//tọa độ X của user (làm tròn đến 1 chữ số hàng thập phân)
						posY = posFit.posY1num;			//tạo độ Y của user (làm tròn đến 1 chữ số hàng thập phân)
						posX2num = posFit.posX2num;		//tọa độ X của user (làm tròn đến 2 chữ số hàng thập phân)
						posY2num = posFit.posY2num;		//tọa độ Y của user (làm tròn đến 2 chữ số hàng thập phân)
						console.log("tọa độ x, y sau khi tính: " + pos)
						console.log("tọa độ x, y sau khi fit với map và làm tròn đến 1, 2 chữ số hàng thập phân: ")
						console.log(posFit)
						console.log("tọa độ x: " + posX)
						console.log("tọa độ y: " + posY)
						var id = user_id
						updateposAGV(id,posX2num,posY2num);		//hàm update tọa độ vào bảng user (update tọa độ được là tròn đến 2 chữ số hàng thập phân)
						resolve( {			//trả về của hàm bất đồng bộ sẽ để trong này 
							'notice'  : 1,		//cờ báo 
							'beacons' : beacons,
							'posX' 	  : posX,		//trả về tọa độ x của user
							'posY'    : posY,		//trả về tọa độ y của user
							'posDesX' : posDesX,		//trả về tọa độ x cần đến
							'posDesY' : posDesY,		//trả về tọa độ y cần đến
							'posDesCarry' : posDesCarry		//trả về cờ báo có tọa độ điểm cần đến nhập vào hay ko
						})
						
				} else {
					resolve( {				//trả về của hàm bất đồng bộ sẽ để trong này 
						'notice' : 0,			//cờ báo lỗi
						'distance' : distance_collects,
						'posX' : 0.0,
						'posY' : 0.0
					})
				}
			});
		});
	})	
}


function updateDistance_collect(beacon_id,user_id,distance){		//update distance vào db
	Distance_collect.findOne({
		beacon: beacon_id,
		user: user_id
	}).exec(function (err, distance_collect) {
		if (err) {
			console.log(err);
		}

		if (!distance_collect) {
			// Create new
			Distance_collect.create({
				beacon: beacon_id,
				user: user_id,
				distance: distance
			}).exec(function (err, distance_collect){
				if (err) { console.log(err); }
			});
		} else {
			// Update
			Distance_collect.update({
				beacon: beacon_id,
				user: user_id
			},{
				distance:distance
			}).exec(function(err, updated){
				if (err) { console.log(err); }
				console.log("updated");
			});
		}
		return;
	});
}


function updateposAGV(id,posX,posY){		//update tọa độ agv vào db
	console.log("đã chạy được vào hàm update tọa độ");
	User.findOne({
		id: id,
	}).exec(function (err, posAGV) {
		if (err) {
			console.log(err);
		}

		if (!posAGV) {
			console.log("ko tìm thấy user");
		} else {
			// Update
			console.log("tìm thấy user")
			User.update({
				id: id,				
			},{
				posX: posX,
				posY: posY
			}).exec(function(err, updated){
				if (err) { console.log(err); }
				console.log("đã update tọa độ agv");
			});
		}
		return;
	});
}


function distanceToDistance(distance, a_parameter, n_parameter){		//trả về distance
	return Math.pow(distance,1);	
}


function leastSquareSolution(beacons){		//trả về giá trị x,y chưa convert sang tọa độ trên bản đồ
	var matrixSize = beacons.length;	
		A = zeros([matrixSize-1,2]);	//tạo matrix A[2,2]
		B = zeros([matrixSize-1,1]);	//tạo matrix B[2,1]
	for (var i = 0; i < matrixSize-1; i++) {
		A[i][0] = 2*(beacons[matrixSize-1].posX - beacons[i].posX);
		A[i][1] = 2*(beacons[matrixSize-1].posY - beacons[i].posY);
		B[i][0] = Math.pow(beacons[i].distance,2) 
				- Math.pow(beacons[matrixSize-1].distance,2) 
				- Math.pow(beacons[i].posX,2) - Math.pow(beacons[i].posY,2) 
				+ Math.pow(beacons[matrixSize-1].posX,2) 
				+ Math.pow(beacons[matrixSize-1].posY,2);
	}
	return multiply(multiply(inv(multiply(transpose(A),A)),transpose(A)),B);		//tính công thức X=(A^T.A)^(-1).A^T.B
}																																								


function zeros(dimensions) {
    var array = [];
    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }
    return array;
}


function multiply(a, b) {	//phép nhân 2 ma trận
	var aNumRows = a.length, aNumCols = a[0].length,
		bNumRows = b.length, bNumCols = b[0].length,
		m = new Array(aNumRows);
	for (var r = 0; r < aNumRows; ++r) {
		m[r] = new Array(bNumCols);
		for (var c = 0; c < bNumCols; ++c) {
			m[r][c] = 0;
			for (var i = 0; i < aNumCols; ++i) {
				m[r][c] += a[r][i] * b[i][c];
			}
		}
	}
	return m;
}


function inv(matrix){
	return utilService.mathUtil.inv(matrix);
}


function transpose(arr) {
	return utilService.mathUtil.transpose(arr);
}


function fitMapTrilateration(pos,mapWidth,mapHeight){		//fit giá trị x, y cho vừa map và làm tròn x, y
	var posX = pos[0][0];
		posY = pos[1][0];
	if (pos[0][0]<0){
		posX = 0;
	} else if (pos[0][0]>mapWidth){		
		posX = mapWidth;		//nếu x lớn hơn chiều rộng map thì cho nó bằng chiều rộng
	}
	if (pos[1][0]<0){
		posY = 0;
	} else if (pos[1][0]>mapHeight){
		posY = mapHeight;		//nếu y lớn hơn chiều dài của map thì cho nó bằng chiều dài  
	}

	var x = parseFloat(posX); posX2num = Math.round(x * 100)/100;				//làm tròn tọa độ x	--- số 10 là làm tròn đến 1 chữ số hàng thập phân
		y = parseFloat(posY); posY2num = Math.round(y * 100)/100;				//làm tròn tọa độ y	--- số 100 là làm tròn đến 2 chữ số hàng thập phân, ....

	var n = parseFloat(posX); posX1num = Math.round(n * 10)/10;			//làm tròn tọa độ x	--- số 10 là làm tròn đến 1 chữ số hàng thập phân
		m = parseFloat(posY); posY1num = Math.round(m * 10)/10;			//làm tròn tọa độ y	--- số 100 là làm tròn đến 2 chữ số hàng thập phân, ....
	return {
		posX1num : posX1num,		//tọa độ x làm tròn đến 1 chữ số hàng thập phân
		posY1num : posY1num,		//tọa độ y làm tròn đến 1 chữ số hàng thập phân
		posX2num : posX2num,		//tọa độ x làm tròn đến 2 chữ số hàng thập phân
		posY2num : posY2num			//tọa độ y làm tròn đến 2 chữ số hàng thập phân
	};
}











	