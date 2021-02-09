const Workout = require("../models/workout")
/* These are all the fetch requests in the public folder so using this to determine 
what routes are needed
api.js:         res = await fetch("/api/workouts");
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
  
  app.get("/api/workouts/range", (req, res) => {
    /*This restricts the range to last 7 days - which is what I think it should be 
    but not what was specified */ 
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
    /* This set the limit to to the latest 7 and requies double sort - 
    first so we can get the latest 7 (descending order) 
    but we want to see the chart in ascending or
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