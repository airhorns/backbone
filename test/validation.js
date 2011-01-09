$(document).ready(function() {

  module("Backbone.Validation");
  
  test("Model declaration: Simple function", function () {
    var Post = Backbone.Model.extend({
      validations: function(attrs, errors) {
        if(attrs.causeError) errors.push("Error!")
      }
    });

    post = new Post;
    
    equals(post.set({other: true}), post); 
    equals(post.set({causeError: true}), false);
  });

  test("Model declaration: Attribute custom function", function () {
    var Post = Backbone.Model.extend({
      validations: {
        title: function(title, errors) {
          if(title == "invalid") errors.push("Must have a valid title.");
        }
     }
    });

    post = new Post;
    
    equals(post.set({other: true}), post); 
    ok(post.isValid());
    equals(post.set({title: "Valid title"}), post); 
    ok(post.isValid());
    equals(post.set({title: "invalid"}), false); 
    ok(post.isValid());
  });

  test("Model declaration: Attribute custom function with key", function () {
    var Post = Backbone.Model.extend({
      validations: {
        title: {
          custom: function(title, errors) {
            if(title == "invalid") errors.push("Must have a valid title.");                 
          }
        }
     }
    });

    post = new Post;
   
    // Setting something valid works 
    equals(post.set({other: true}), post); 
    ok(post.isValid());
    equals(post.set({title: "Valid title"}), post); 
    ok(post.isValid());

    // Settings something invalid doesn't take, and returns errors
    equals(post.set({
      title: "invalid"
    }, {
      error: function(model, errors) { 
        equals(errors.title[0], "Must have a valid title.")
      }
    }), false);
    ok(post.isValid());

    // Setting something invalid while supressing validation works, but 
    // is deemed invalid later.
    equals(post.set({title: "invalid"}, {validate: false, silent: true}), post); 
    equals(post.isValid(), false);
    deepEqual(post.errors(), {title: ["Must have a valid title."]});
  });

  test("Model declaration: Clear resets status", function () {
    var Post = Backbone.Model.extend({
      validations: {
        title: function(title, errors) {
          if(title == "invalid") errors.push("Must have a valid title.");
        }
     }
    });

    post = new Post;

    equals(post.set({title: "invalid"}, {validate: false}), post); 
    equals(post.isValid(), false);

    post.clear();

    ok(post.isValid());
  });

  test("Model declaration: Base functions get all attributes", function () {
    var basePassed = "", titlePassed = "";

    var Post = Backbone.Model.extend({
      validations: {
        base: function(attrs, errors) {basePassed = attrs;},
        title: function(title, errors) {titlePassed = title;}              
      }
    });

    post = new Post; 
    equals(post.set({other: "123", title: "XYZ"}), post);
    equals(basePassed.other, "123");
    equals(basePassed.title, "XYZ");
    equals(titlePassed, "XYZ");
  });

  test("Model declaration: Custom functions get the proper arguments.", function () {
    var basePassed = "", titlePassed = "";

    var Post = Backbone.Model.extend({
      validations: {
        base: function(attrs, errors) {basePassed = attrs;},
        title: function(title, errors) {titlePassed = title;}              
      }
    });

    post = new Post; 
    equals(post.set({other: "123", title: "XYZ"}), post);
    deepEqual(basePassed, {other: "123", title: "XYZ"});
    equals(titlePassed, "XYZ");
  });

});
