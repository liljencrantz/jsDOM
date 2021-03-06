/*
  jsDOM benchmark suite
  Copyright (C) 2010 Axel Liljencrantz

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; version 2 of the License.
  
  This program is distributed in the hope that it will be useful, but
  WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  General Public License for more details.
  
  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
  02110-1301, USA.

 */
/**
  All of the jsDOM code lives in the jsDOM namespace to keep
  everything nice and tidy.

  Inside jsDOM, the tests namespace contains all available tests.
 */
var jsDOM = {
    /**
       The number of times to run each test.
     */
  TRIAL_LAPS: 10,
    /**
       The version of the benchmark. Whenever tests are added or updated, this version should be bumped.
     */
  VERSION: "1-pre2",

  /**
     This namespace (jsDOM.tests) is a hash that contains all the
     individual tests.
     
     Each test is a hash that consists of three parts, a description
     field that explains what the test does, a setup function that
     performs any DOM manipuations that might be needed prior to
     running the test that should not be part of the test time, and
     finally a main function which is what is measured.
     
     For a description of what each test does,
     read the description field of each test.
     
     More DOM test ideas for the future: 
     
     - Inserting and then removing very long text nodes.
     - Animations.
   */
  tests: 
  {

    tableCreation:
    {
	/*
	  Nothing to set up for this test
	 */
      setup:function(){},
      main:function()
      {
	  var table = $("<table id='myTable'></table>");
	  $("body").append(table);
	  for(var i=0; i<50; i++){
	      var row = $("<tr></tr>");
	      for(var j=0; j<5; j++){
		  row.append($("<td></td>").text("Test"));
	      }
	      table.append(row);
	  }
      },
      description:"This test measures the time it takes to create a large but simple HTML table (50 rows, 5 columns) containing only unformated text by creating individual cells one at a time."
    },

    tableCloning:
    {
      setup:function(){
	  var table = $("<table id='myTable'></table>");
	  $("body").append(table);
	  var row = $("<tr></tr>");
	  for(var j=0; j<5; j++){
	      row.append($("<td></td>").text("Test"));
	  }
	  table.append(row);
	  jsDOM.tests.tableCloning.original = row;
	  jsDOM.tests.tableCloning.table = table;
      },
      main:function()
      {
	  for(var i=0; i<50; i++){
	      jsDOM.tests.tableCloning.table.append(jsDOM.tests.tableCloning.original.clone());
	  }
      },
      description:"This test measures the time it takes to create a large but simple HTML table (50 rows, 5 columns) containing only unformated text by cloning preexisting table rows. This technique is usually faster than creating the DOM nodes manually, but is not suitable for all types of content."
    },

    tableRemoval:
    {
      setup:function(){
	  var table = $("<table id='myTable'></table>");
	  for(var i=0; i<50; i++){
	      var row = $("<tr></tr>");
	      for(var j=0; j<5; j++){
		  row.append($("<td></td>").text("Test").attr("id","el"+i+"_"+j));
	      }
	      table.append(row);
	  }
	  $("body").append(table);
	},
      main:
      function(){
	  for(var i=0; i<50; i++){
	      for(var j=0; j<5; j++){
		  $("#el"+i+"_"+j).remove();
	      }
	  }
      },
      description: "This test measures the time it takes to remove a large HTML table (50 rows, 5 columns), one table cell at a time."
    },

    elementSearch:
    {
      setup:function(){
	    var classNames = ["foo","bar","baz"];
	    var table = $("<table id='myTable'></table>");
	    for(var i=0; i<50; i++){
		var row = $("<tr></tr>").addClass(classNames[i%4]);
		for(var j=0; j<5; j++){
		    row.append($("<td></td>").text("Test").attr("id","el"+i+"_"+j).addClass("foo_"+i));
		}
		table.append(row);
	    }
	    $("body").append(table);
	},
      main:
      function(){
	  for(var i=0; i<20; i++){
	      $("table tr.bar td:last").length;
	      $("table tr:odd .foo_4").length;
	  }
      },
      description: "This test measures the time it takes to search through the nodes of a medium sized page using complex search criteria, such as \"table tr.bar td:last\". A grand total of 40 node searches are performed in each lap."
    },

    simpleStyling:
    {
      setup:function(){
	  var table = $("<table id='myTable'></table>");
	  for(var i=0; i<50; i++){
	      var row = $("<tr></tr>");
	      for(var j=0; j<5; j++){
		  row.append($("<td></td>").text("Test").attr("id","el"+i+"_"+j));
	      }
	      table.append(row);
	  }
	  $("body").append(table);
	},
      main:
      function()
      {
	  var colors=["#000","#007","#00f","#070","#077","#07f","#0f0","#0f7","#0ff","#700","#707","#70f","#770","#777"];
	  for(var i=0; i<50; i++){
	      for(var j=0; j<5; j++){
		  $("#el"+i+"_"+j).css("color", colors[(i+j)%13]);
		  $("#el"+i+"_"+j).css("background-color", colors[(i+j+1)%13]);
	      }
	  }
      },
      description: "This test measures the time it takes to perform simple style changes on individual elements in the DOM. A large number of elements get their color changed (using the color and background-color css attributes). A grand total of 250 elements are updated."
    },

    complexStyling:
    {
      setup:function(){
	  var table = $("<table id='myTable'></table>");
	  for(var i=0; i<50; i++){
	      var row = $("<tr></tr>");
	      for(var j=0; j<5; j++){
		  row.append($("<td></td>").text("Test").attr("id","el"+i+"_"+j));
	      }
	      table.append(row);
	  }
	  $("body").append(table);
	},
      main:
      function(){
	  var css_prop=["width","margin","padding","border-style","border-style","width","margin-left","font-family","font-family","font-family","font-style"];
	  var css_val=["100px","5pt","1em","solid","none","10%","5px","serif","sans-serif","monospace","italic"];
	  var offsets=[];
	  for(var i=0; i<50; i++){
	      for(var j=0; j<5; j++){
		  $("#el"+i+"_"+j).css(css_prop[(i+j)%11], css_val[(i+j)%11]);
		  $("#el"+i+"_"+j).css(css_prop[(i+j+1)%11], css_val[(i+j+1)%11]);
		  offsets.push($("#el"+i+"_"+j).offset());
	      }
	  }
      },
      description: "This test measures the time it takes to perform more complex style changes on individual elements in the DOM. A large number of elements get their width, margin, padding and various other attributes changed. These attribute changes force the browser to reflow parts of the page, which may be more expensive than simply changing colors of an element, as is done in the simpleStyling test. A grand total of 250 elements are updated. In order to force the browser to reflow the document, the position of each table cell is calculated after each style change."
    },

    formCreation:
    {
      setup:function(){
	  var table = $("<form name='tjoho' action='' method='post'><table id='myTable'></table></form>");
	  for(var i=0; i<10; i++){
	      var row = $("<tr></tr>");
	      for(var j=0; j<6; j++){
		  row.append($("<td></td>").attr("id","el"+i+"_"+j));
	      }
	      table.append(row);
	  }
	  $("body").append(table);
	},
      main:
      function(){
	  function makeInput(name, type, value, idSuffix){
	      var id = "" + name;
	      if(idSuffix)
	      {
		  id += "_"+idSuffix;
	      }
	      return $("<label for='" + id + "'>" + id + "</label><input type='" + type + "' value='" + value + "' name='"+name+"' id='"+id+"'>");
	  }
	  for(var i=0; i<10; i++){
	      $("#el"+i+"_0").append(makeInput("form"+i+"_0", 'text',''));
	      var sel = $("<select></select>");
	      //.append($("<option value='1'>O1</option><option value='2'>O2</option><option value='3'>O3</option><option value='4'>O4</option><option value='5'>O5</option><option value='6'>O6</option>")));
	      for(var j=0; j<20; j++){
		  sel.append($("<option value='"+j+"'>Option number "+j+"</option>"));
	      }
	      $("#el"+i+"_1").append(sel);
	      $("#el"+i+"_2").append(makeInput("form"+i+"_2", 'text','Bla bla bla bla bla bla bla'));
	      $("#el"+i+"_3").append(makeInput("form"+i+"_3", 'checkbox','1','1')).append(makeInput("form"+i+"_3", 'checkbox','2','2')).append(makeInput("form"+i+"_3", 'checkbox','3','3')).append(makeInput("form"+i+"_3", 'checkbox','4','4'));
	      $("#el"+i+"_4").append(makeInput("form"+i+"_4", 'radio','1','1')).append(makeInput("form"+i+"_4", 'radio','2','2')).append(makeInput("form"+i+"_4", 'radio','3','3')).append(makeInput("form"+i+"_4", 'radio','4','4'));
	      $("#el"+i+"_5").append($("<textarea>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</textarea>"));
	      $("form").outerWidth();
	  }
	  
      },
      description: "This test measures the time it takes to create form elements. Each run of this test creates a form with 20 rows, each row consisting of six columns, and each column containing either a text field, a dropdown list, a set of checkboxes, a set of radiobuttons or a textarea. Most form items have an associated label as well. In order to force the browser to reflow the document, the size of the table is calculated after each line of the form is added."
    },

    classChange:
    {
      setup:function(){
	  var table = $("<table id='myTable'></table>");
	  for(var i=0; i<50; i++){
	      var row = $("<tr></tr>");
	      for(var j=0; j<5; j++){
		  row.append($("<td></td>").text("Test").attr("id","el"+i+"_"+j));
	      }
	      table.append(row);
	  }
	  $("body").append(table);
	  var me = jsDOM.tests.classChange;
	  me.elem1 = $("tr");
	  me.elem2 = $("td");
	},
      main:
      function(){
	  var me = jsDOM.tests.classChange;
	  me.elem1.addClass("style1");
	  me.elem1.outerWidth();
	  me.elem1.addClass("style2");
	  me.elem1.outerWidth();
	  me.elem1.addClass("style3");
	  me.elem1.outerWidth();
	  me.elem1.removeClass("style3");
	  me.elem1.outerWidth();
	  me.elem1.removeClass("style2");
	  me.elem1.outerWidth();
	  me.elem1.removeClass("style1");
	  me.elem1.outerWidth();

	  me.elem2.addClass("style1");
	  me.elem2.outerWidth();
	  me.elem2.addClass("style2");
	  me.elem2.outerWidth();
	  me.elem2.addClass("style3");
	  me.elem2.outerWidth();
	  me.elem2.removeClass("style3");
	  me.elem2.outerWidth();
	  me.elem2.removeClass("style2");
	  me.elem2.outerWidth();
	  me.elem2.removeClass("style1");
	  me.elem2.outerWidth();
      },
      description: "This test measures the time it takes to add and remove css classes from dom nodes. A large number of elements get their colors and sizes changed by the adding and removing of css classes. These tests are performed on atable containg 50 rows with five columns each. Three different css classes are added and removed to all rows of the table and then later to all cells of the table. In order to force the browser to reflow the document, the size of the table is calculated after each style change."
    }

  },
    
  Timer: function()
  {
      this.interval=0;
      this.start = function(){
	  this.stopTime = null; 
	  this.startTime = (new Date().getTime()); 
	  return this;
      };
      this.stop = function(){
	  if(!this.startTime){
	      this.stopTime = null;
	  } else {
	      this.stopTime = (new Date().getTime()); 
	      this.interval += (this.stopTime - this.startTime);
	  }
	  return this;
      };
      this.time = function(){
	  if(!this.startTime) {
	      return null;
	  }
	  if(!this.stopTime) {
	      this.stop();
	  }
	  return this.interval;
      };
  },

  /**
     Empty the document body.
   */
  wipe: 
  function(){
      $("body").empty();
  },

  showComparison: function(score){
      var data = ([
		      ["Microsoft Internet Explorer 8 (8.0.6001.18702)", 0.7],
		      ["Mozilla Firefox 3.6 (3.6.11)", 1.36],
		      ["Opera 10 (10.63 build 3516)", 1.6],
		      ["Apple Safari 5 (5.0.2 (7533.18.5))", 4.3],
		      ["Google Chrome 7 (7.0.514.41)", 5.01]
		      ]);
      
      var gdata=[];
      var tdata=[];
      $.each(data, function(key,value){
	      gdata.push([key+0.1, value[1]]);
	      tdata.push([key+0.5, value[0]]);
	  });
      tdata.push([data.length+0.5, "Your system"]);
      
      $("body").append($("<p>").text("For comparison, the graph below shows how your system compares with some common browsers running Microsoft Windows Server 2003 SP2 on a Intel Core 2 Duo E4600 2.4 GHz machine. The machine was run through a Remote Desktop session, which may affect the outcome of the test."));

      $("body").append($("<div id='placeholder' style='width:800px;height:300px'></div>"));

      $.plot(
	  $('#placeholder'),
	  [
	      {
		data: gdata,
		      bars: {show:true},
		      color: "#f00"		      
		      },
	      
	      {
		data: [[data.length+0.1,score]],
		      bars: {show:true},
		      color: "#0f0"		      
	      }
	      ],{
	    xaxis: {ticks: tdata},
		  series:{
		bars:{barWidth:0.8}
		      }
	  }); 
  },
    
  /**
     Show the test results on screen.
   */
  showResults:
  function(results){

      /*
	Calculate the numerical score. It is the inverse of the sum of
	the average time for each test.
       */
      var score = 0;
      $.each(
	  results,
	  function(testName, test){
	      score += test.time;
	  });
      score = 1/score;

      /*
	Ugly little function for displaying reasonably rounded floating point numbers
       */
      var numFormat = function(number, digits){
	  digits = digits || 2;
	  var factor = Math.pow(10, digits);
	  var num = Math.round(number*factor)/factor;
	  return "" + num;
      };

      $("body").append($("<p>").text("The jsDOM benchmark suite version "+jsDOM.VERSION+" has been run on your computer. This test suite focuses on the speed of so called DOM manipulation in JavaScript. DOM manipulation is the main way that JavaScripts in web pages push updates onto the screen. "));

      $("body").append($("<p>").html("Your jsDOM "+jsDOM.VERSION+" score is <b>" + numFormat(score) + "</b> (Higher is better). A score of ten or above indicates that your system is highly suitable for rendering javascript generated web pages. Please remember that browser score depends both on your web browser, your computer and your operating system."));
      

      $("body").append($("<p>").html("The test was run a total of " + jsDOM.TRIAL_LAPS + " laps. The more laps are run, the more accurate the results will be. You can rerun the tests with a different number of laps by filling out the number of laps you wish to run and clicking the rerun button below."));

      /*
	Add a little form to rerun the benchmark.
       */
      var miniform = $("<div></div>");
      var input =$("<input style='text-align:right' size='3' maxlength='3' value='" + jsDOM.TRIAL_LAPS + "'>");
      input.change(
	  function(ev){
	      jsDOM.TRIAL_LAPS = parseInt(this.value, 10) || 10;
	  });
      miniform.append(input);
      miniform.append($("<span></span>").html("laps&nbsp;&nbsp;"));
      var button = $("<button type='button'>Rerun tests!</button>");
      button.click(
	  function(){
	      /*
		Remove the handler. We don't want the tests to run
		twice if the user gets impatient.
	       */
	      button.unbind('click');
	      jsDOM.runTests();	      
	  });
      miniform.append(button);
      
      $("body").append(miniform);

      jsDOM.showComparison(score);

      $("body").append($("<ul id='results'></ul>"));
      var list = $("#results");
      $.each(
	  results,
	  function(testName, test){
	      var text = "The " + testName + " test took " + numFormat(test.time,3) + " seconds per lap. ";
	      text += test.description;
	      list.append($("<li>").text(text));
		  });

      $("body").append($("<p>").html("For more information about how the benchmark score is calculated and why, see the <a href='README'>README</a> file. For a more detailed look at what the benchmark does, you're welcome to check out the <a href='jsDOM.js'>source code</a>. The jsDOM source code is free software released under <a href='LICENSE'>GPL version 2</a>; feel free to suggest or implement improvements."));
  },
    
  /**
     Run all tests multiple times and display the test results on
     screen.
   */
  runTests: 
  function(){
      var results = {};
      $.each(
	  jsDOM.tests, 
	  function(testName, test){
	      /*
		We'll be using the same timer object for every lap,
		and turning it off and on again in order to only
		measure the actual test time.
	       */
	      var timer = (new jsDOM.Timer());
	      for(var i=0; i<jsDOM.TRIAL_LAPS; i++)
	      {
		  /*
		    First run the setup code 
		   */
		  test.setup();
		  
		  /*
		    Then time the runtime of the main code.
		   */
		  timer.start();
		  test.main();
		  timer.stop();

		  /*
		    Finally clear the body.
		   */
		  jsDOM.wipe();
		  
	      }
	      test.time = timer.time()/(jsDOM.TRIAL_LAPS*1000);
	      results[testName] = test;
	  });
      jsDOM.showResults(results);
  }
};

$(document).ready(
    function(){
	/*
	  Check if the number of laps was specified in the URL
	*/
	if(window.location.hash !== "")
	{
	    jsDOM.TRIAL_LAPS = parseInt(window.location.hash.substr(1), 10);
	}
	jsDOM.runTests();
    });
