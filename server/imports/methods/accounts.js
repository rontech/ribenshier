ServiceConfiguration.configurations.update(
   { "service": "wechat" },
   {
    	$set: {
      	"service": "wechat",
       	"appId": "wxdd15b6922237eac5",
       	"secret": "d19ca18ad6bbc9bb2be1bd93e28db5a1"
     	}
   },
   { upsert: true } // If doesn't find wechat, insert one
);
