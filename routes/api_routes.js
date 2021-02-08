const Workout = require("../models/workout")
/* These are all the fetch requests in the public folder
api.js:      res = await fetch("/api/workouts");
api.js:    const res = await fetch("/api/workouts/" + id, {
api.js:    const res = await fetch("/api/workouts", {
api.js:    const res = await fetch(`/api/workouts/range
*/


module.exports = function(app) {
  //verified code works
  app.get('/api/workouts', (req, res) => {
    Workout.find({})
    /* adds field totalDuration - required to return the total duration to the stats
    Does not update the database just adds to the fields in the response */
    Workout.aggregate([
      {"$addFields":{
        "totalDuration":{
          "$sum":"$exercises.duration"
        }}
      }
    ])
    .sort({ date: -1 })//desending order should return the newest first
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    })
   
  });
  
  app.put('/api/workouts/:id', (req, res) => {
        let rec_id = req.params.id;
        rec_id.trim(); //make sure no spaces
        //findOneAndUpdate(filter, update, options)
        Workout.findOneAndUpdate(
            {_id: rec_id}, // filter
            {
                $push: {
                    exercises: req.body,
                }
            },//update
            {new: true}//options
        )
            .then(data => {
                res.json(data);
            })
            .catch(err => {
                res.status(400).json(err);
            });
  });
  
  app.post("/api/workouts", (req, res) => {
    Workout.create(req.body)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    }); 
  });
  
  //db.yourCollectionName.find ().sort ( {$natural:-1}).limit (yourValue);//

  app.get("/api/workouts/range", (req, res) => {
    let startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    let endDate =  new Date(Date.now());
    Workout.find({day: {$gte: startDate, $lte: endDate}})
    Workout.aggregate([
      {"$addFields":{
        "totalDuration":{
          "$sum":"$exercises.duration"
        }}
      }
    ])
    /* have to do a double sort so that we get the latest 7
    but we want to get them in ascending order on the chart
    */
    .sort({ day: -1 }).limit(7).sort({day: 1}) 
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
  });



}