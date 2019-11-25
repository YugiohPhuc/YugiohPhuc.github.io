 /**
  * Phần này thiết lập các phương thức để thực thi (nó dựa vào controller)
  * Có thể dùng phần mềm Postman để giả lập 1 client, dùng các phương thức này để giao tiếp vs server 
  * /

/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

 module.exports.routes = {   

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  ////////////////////////////////////////////////////////////
  // Server-rendered HTML webpages
  ////////////////////////////////////////////////////////////
  'GET /signup': {view: 'signup'},
  'GET /': 'PageController.showHomePage',


  ////////////////////////////////////////////////////////////
  // JSON API
  ////////////////////////////////////////////////////////////
  'POST /signup': 'UserController.signup',    // "UserController": là tên của controller --- "signup": là tên của action
  'PUT /login': 'UserController.login',
  'GET /logout': 'UserController.logout',


  ////////////////////////////////////////////////////////////
  // CREATE NEW API
  ////////////////////////////////////////////////////////////
  'POST /createbeacon': 'BeaconController.createbeacon',
  'POST /createmap': 'MapController.createmap',




  ////////////////////////////////////////////////////////////
  // Query Database
  ////////////////////////////////////////////////////////////
  'PUT /getalluser' : 'UserController.getalluser',
  'PUT /getallbeacon' : 'BeaconController.getallbeacon',
  'PUT /getallmap' : 'MapController.getallmap',
  'PUT /getmapsize' : 'MapController.getmapsize',
  'PUT /getmapfile' : 'MapController.getmapfile',
  'PUT /mindistance'  : 'MapController.mindistance',

  


  ////////////////////////////////////////////////////////////
  // Receive distance Online from device
  ////////////////////////////////////////////////////////////
  'PUT /putdistancecollected' : 'Distance_collectController.putdistancecollected',    //lấy dữ liệu từ device   
  'PUT /particlefilter' : 'ParticleController.particlefilter',    //cái này ko biết để làm gì???
  'PUT /updatecurrentmap' : 'MapController.updatecurrentmap',     //cái này ko biết???
  'GET /testajax' : 'MapController.testajax',     //cái này ko biết???


  
  ////////////////////////////////////////////////////////////
  // Position Destination Input
  ////////////////////////////////////////////////////////////
  'GET /posDestination' : 'Distance_collectController.posDestination',


  ////////////////////////////////////////////////////////////
  // Control By Server
  ////////////////////////////////////////////////////////////
  'PUT /controlByServer' : 'Distance_collectController.controlByServer',
  'GET /chossemodeByServer' : 'Distance_collectController.chossemodeByServer'




  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
};
