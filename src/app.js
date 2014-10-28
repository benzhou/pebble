/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var main;

var parseFeed = function(data) {
  var items = [];
  for(var i = 0, l=data.length; i < l; i++) {
    // Always upper case the description string
    var title = data[i].year + "-" + data[i].month + "-" + data[i].day + " " + data[i].hour + ":00:00";

    // Add to menu items array
    items.push({
      title:title,
      subtitle:data[i].incVal/1000 + "kwh"
    });
  }

  // Finally return whole array
  return items;
};

// Show splash screen while waiting for data
var splashWindow = new UI.Window({
  backgroundColor:'white'
});

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 30),
  size: new Vector2(144, 40),
  text:'Downloading Energy data...',
  font:'GOTHIC_28_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();

var requestData = function(){
  var today = new Date();
  console.log('the year of today is: ' + today.getUTCFullYear());
  console.log('the month of today is: ' + today.getUTCMonth());
  console.log('the date of today is: ' + today.getUTCDate());
  
  ajax({
    url:'http://sinonovatechnology.com/app/restful/list',
    type:'json',
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    data:{"f":{"year":today.getUTCFullYear(),"month":today.getMonth()+1,"day":today.getDate()},"col":"kwh","db":"kwatt"}
  },
  function(data) {
    // Create an array of Menu items
    var menuItems = parseFeed(data);

    // Construct Menu to show to user
    main = new UI.Menu({
      sections: [{
        title: 'Current Energy Usage',
        items: menuItems
      }]
    });

    // Add an action for SELECT
    main.on('select', function(e) {
      console.log('Item number ' + JSON.stringify(e.item) + ' was pressed!');
    });

    // Show the Menu, hide the splash
    main.show();
    splashWindow.hide();
  },
  function(error) {
    console.log('Download failed: ' + error);
  });
};

requestData();

/*
var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello World!',
  body: 'Press any button.'
});

main.show();

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window();
  var textfield = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
*/
