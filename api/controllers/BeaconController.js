/**
 * Để tạo và thiết lập dữ liệu cho beacon
 */


/**
 * BeaconController
 *
 * @description :: Server-side logic for managing beacons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getallbeacon: function (req, res) {
		Beacon.find().populate('map').exec(function(err, beacons) {
			if (err) return res.negotiate(err);
			return res.json({
				'beacons':beacons
			});
		});
	},

	createbeacon: function (req, res) {
		Beacon.create({
			name: req.param('name'),
			model: req.param('model'),
			map: req.param('map'),
			bssid: req.param('bssid'),
			ssid: req.param('ssid'),
			posX: req.param('posX'),
			posY: req.param('posY')
        }, function beaconCreated(err, newBeacon) {
          if (err) {

            console.log("err: ", err);
            console.log("err.invalidAttributes: ", err.invalidAttributes)

            // If this is a uniqueness error about the email attribute,
            // send back an easily parseable status code.
            if (err.invalidAttributes.name[0].rule === 'unique') {
              return res.nameInUse();
            }
            // Otherwise, send back something reasonable as our error response.
            return res.negotiate(err);
          }
          return res.redirect('/');
        });
	}
};

