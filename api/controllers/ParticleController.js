/**									CÁI NÀY ĐỂ GIẢM NHIỄU, NHƯNG TRONG PROJECT NÀY KO DÙNG 								*/
/**							******************************************************************** 								*/

/**
 * ParticleController
 *
 * @description :: Server-side logic for managing particles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	particlefilter : function(req, res){
		User.findOne({
			id: req.param('userid')
		}).populate('map').exec(function (err, user) {
			if (err) {
				return err;
			} else {
				if (!user) return res.notFound();
				if (req.param('init_particles')=="1"){
					var particles = initParticles(user.id, 1000, user.map.height, user.map.width);
				} else {
					var particles = JSON.parse(req.param('particles'));
				}
				// Normalize orientation with map
				var normalizeOrientation = parseFloat(req.param('compass')) - user.map.orientation;
					deltaPos = convertTo2D(parseFloat(req.param('distance')), normalizeOrientation);

				updateParticle(res, user.id, deltaPos.posX, deltaPos.posY, user.posX, user.posY, particles);
			}
		});
	}
};

function initParticles(userid, numberOfParticles, mapHeight, mapWidth){
	var particles = [];
	for (i = 0; i < numberOfParticles; i++) {
		var particle = {
			id : i,
			posX : generateRandomNumber(0,mapWidth),
			posY : generateRandomNumber(0,mapHeight),
			weight : 0
		}
		particles.push(particle);
	}
	return particles;
}

function generateRandomNumber(min,max) {
	var	highlightedNumber = Math.random() * (max - min) + min;
	return highlightedNumber.toFixed(3);
}

function updateParticle(res, userid, deltaX, deltaY, prePosX, prePosY, particles){
	var distance_noise = 0.7;
		sense_noise = 0.5;
	if (!particles) console.log('Particles is empty');
	else {
		// Max weight
		var mw = 0.0;
		var particles_updated = particles.map(function(particle){
			// move
			particle.posX = parseFloat(particle.posX) + deltaX + normallyDistributed(distance_noise);
			particle.posY = parseFloat(particle.posY) + deltaY + normallyDistributed(distance_noise);
			particle.weight = measureProb(particle.posX, particle.posY, prePosX, prePosY, sense_noise);
			if (mw < particle.weight){
				mw = particle.weight;
			}
			return particle;
		});
		var particles_resampled = resamplingWheel(particles_updated, mw);

		return res.json({
			particles : particles_resampled,
			particles_center : getCenter(particles_resampled)
		});
	}
	return res.ok();
}

function convertTo2D(distance, orientation){
	return {
		posX : distance*Math.sin(orientation/180*Math.PI),
		posY : -distance*Math.cos(orientation/180*Math.PI)
	}
}

//normally distributed random numbers
function normallyDistributed(gauss_noise) {
    return gauss_noise*((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

function Gaussian(pos, sense_noise, prePos){
	var gaussian = Math.exp((- Math.pow(pos - prePos, 2) / Math.pow(sense_noise, 2) / 2.0) / Math.sqrt(2.0 * Math.PI * Math.pow(sense_noise, 2)));
	return gaussian;
}

function measureProb(posX, posY, prePosX, prePosY, sense_noise){
    var prob = Gaussian(posX, sense_noise, prePosX) * Gaussian(posY, sense_noise, prePosY);
    return prob;
}

function resamplingWheel(particles_updated, maxWeight){
	var beta = 0.0;
		N = particles_updated.length;
		index = Math.floor(Math.random()*N);
		particles_resampled = [];
	for (i=0; i < N; i++){
		beta += Math.random() * 2.0 * maxWeight;
		while (beta > particles_updated[index].weight){
			beta -= particles_updated[index].weight;
			index = (index + 1) % N;
		}
        particles_resampled.push(particles_updated[index]);
	}
	return particles_resampled;
}

function getCenter(arr)
{
    var x = arr.map(function(a){ return a.posX });
    	y = arr.map(function(a){ return a.posY });
    	minX = Math.min.apply(null, x);
    	maxX = Math.max.apply(null, x);
    	minY = Math.min.apply(null, y);
    	maxY = Math.max.apply(null, y);
    return {
    	posX : (minX + maxX)/2,
    	posY : (minY + maxY)/2
    };
}