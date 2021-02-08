const Workout = require("../models/workout")
module.exports = function(app) {

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "./public/index.html"));
  });
  
  app.post("/submit", (req, res) => {
    console.log(req.body);
  
    Workout.insert(req.body, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    });
  });
  
  app.get("/workouts", (req, res) => {
    db.exercise.find({}, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.json(data);
      }
    });
  });
  
  app.get("/find/:id", (req, res) => {
    db.exercise.findOne(
      {
        _id: mongojs.ObjectId(req.params.id)
      },
      (error, data) => {
        if (error) {
          res.send(error);
        } else {
          res.send(data);
        }
      }
    );
  });
  
  app.post("/update/:id", (req, res) => {
    db.exercise.update(
      {
        _id: mongojs.ObjectId(req.params.id)
      },
      {
        $set: {
          day: req.body.title,
          note: req.body.note,
          modified: Date.now()
        }
      },
      (error, data) => {
        if (error) {
          res.send(error);
        } else {
          res.send(data);
        }
      }
    );
  });
  
  app.delete("/delete/:id", (req, res) => {
    db.notes.remove(
      {
        _id: mongojs.ObjectID(req.params.id)
      },
      (error, data) => {
        if (error) {
          res.send(error);
        } else {
          res.send(data);
        }
      }
    );
  });
  
  app.delete("/clearall", (req, res) => {
    db.notes.remove({}, (error, response) => {
      if (error) {
        res.send(error);
      } else {
        res.send(response);
      }
    });
  });

}