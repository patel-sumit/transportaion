if (navigator.serviceWorker) {
   navigator.serviceWorker.register('./service-worker.js').then(function (reg) {
       console.log("src registered");
   }).catch(function (error) {
       console.log(error);
   });
}




