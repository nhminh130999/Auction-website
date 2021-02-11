const Cronjob = require("cron").Cronjob;
const Post = require("./API/Models/Post_model");
var check_post_status = new Cronjob("15 * * * *", () => {
  Post.find()
    .exec()
    .then((docs) => {
      docs.map((doc) => {
        if (Date.now() > doc.time_end) {
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
