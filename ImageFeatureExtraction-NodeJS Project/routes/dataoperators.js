var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");
var async = require('async');
var fs = require('fs');
const download = require('image-downloader');
var AWS = require('aws-sdk');
const stream = require('stream');
var base64 = require('file-base64');
var dateTime = require('node-datetime');
var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/assets/images');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage }).array('userPhoto',3);

var port = process.env.PORT || 5000;
AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.Credentials("AKIAJPCPN4HXODBBXJ7A", "ChK3j9VAvR/UFW59kYOywnuvbmzsWQUBCmIh9tLM");
var mlabkey="0IUPta4Xti13RA5KsXbUItjhVK938r0t";


//====================================================================APIs===================================================================



app.post('/api/photo',function(req,res){
	
	var filenames=new Array();
	var text="";
	var labels="";
	var celebrity="";
	var keyphrases=new Array();
	var kp=0;
	var unique_items={};
	
	function three()
	{
			var result="";
			result=result.concat("{");
			result=result.concat("\"productname\":\"").concat(filenames[0].substr(0,filenames[0].indexOf(".")-1)).concat("\",");
			result=result.concat("\"productimages\":[\"").concat(filenames[0]).concat("\",\"").concat(filenames[1]).concat("\",\"").concat(filenames[2]).concat("\"],");
			result=result.concat("\"textualDescription\":\"").concat(text.replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")).concat("\",");
			result=result.concat("\"labels\":\"").concat(labels.replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")).concat("\",");
			result=result.concat("\"celebrities\":\"").concat(celebrity.replace(/"/g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")).concat("\",");
			result=result.concat("\"keyphrases\":[")
			for(var j=0;j<kp;j++)
			{
				result=result.concat("\"").concat(keyphrases[j].replace(/"/g, "").replace(/\//g, "").replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t")).concat("\"");
				
				if(j<=kp-2)
					result=result.concat(",");
			}
			
			result=result.concat("]");
			result=result.concat("}");
			console.log("----------------------------------------"+result);
			result = JSON.parse(result);
			
			request("https://api.mlab.com/api/1/databases/rakuten/collections/products?apiKey="+mlabkey, function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				var res1=JSON.parse(body);
				var id="";
				for(var i=0;i<res1.length;i++)
				{
					if(res1[i].productname==filenames[0].substr(0,filenames[0].indexOf(".")-1))
					{
						id=res1[i]._id.$oid;
						break;
					}
				}
				if(id != "")
				{
								request.delete('https://api.mlab.com/api/1/databases/rakuten/collections/products/' + id + '?apiKey='+mlabkey, function(error, response, body) {
								if (!error && response.statusCode == 200) 
								{

										console.log("deleted...");
								
										request.post('https://api.mlab.com/api/1/databases/rakuten/collections/products?apiKey='+mlabkey, {
										json: result
											},
											function(error, response, body) {
												if (!error && response.statusCode == 200) {
													console.log("----->" + body);
													//res.status(200).send("Product images have been uploaded and analysis has been stored in MongoDB");
													res.status(200).send("Success!");
												} else
													console.log("-----XXXXX>" + JSON.stringify(response));
											}
										);
								   
								}
								});
				}
				else
				{
										request.post('https://api.mlab.com/api/1/databases/rakuten/collections/products?apiKey='+mlabkey, {
										json: result
											},
											function(error, response, body) {
												if (!error && response.statusCode == 200) {
													console.log("----->" + body);
													//res.status(200).send("Product images have been uploaded and analysis has been stored in MongoDB");
													res.status(200).send("Success!");
												} else
													console.log("-----XXXXX>" + error);
											}
										);
				}
				
			}
		});	
			
	}	
	
	
	function second(callback)
	{
		async.each(filenames, function(apiRequest, cb) {
        apicall(apiRequest, cb);

        }, function(err) {
            if (err)
                console.log("error...");
            else
                process_arrays();
        });

        function apicall(item,cb)
        {
                        var rekognition = new AWS.Rekognition();
						var ind=parseInt(item.substr(item.indexOf(".")-1,item.indexOf(".")));
						
						if(!(ind in unique_items))
						{
								unique_items[ind]=1;
								fs.readFile('public/assets/images/'+item, 'base64', (err, data) => {
								const buffer = new Buffer(data, 'base64');

								  // now that we have things in the right type, send it to rekognition
								rekognition.detectText({
									  Image: {
										Bytes: buffer
									  }
									}).promise()
									.then((res) => {

											// print out the labels that rekognition sent back
											rekognition.detectLabels({
											  Image: {
												Bytes: buffer
											  }
											}).promise()
											.then((res1) => {
													
															rekognition.recognizeCelebrities({
													  Image: {
														Bytes: buffer
													  }
													}).promise()
													.then((res2) => {

															//Detect Text Analysis 
															console.log("res1:**** "+JSON.stringify(res));
															console.log("res2:---- "+JSON.stringify(res1));
															console.log("res3:^^^^ "+JSON.stringify(res2));


															  var r = JSON.parse(JSON.stringify(res));
															  var str = "";
															  if(r.TextDetections.length != 0)
															  {
																for(var k=0;k<r.TextDetections.length;k++)
																	str = str.concat(r.TextDetections[k].DetectedText+", "); 
			   
															  }
															  

															  // Detect Label Analysis
															var r1 = JSON.parse(JSON.stringify(res1));
															console.log("*******$$$$$$$*******>>>>>"+JSON.stringify(res1));
															var str1 = "";
															if(r1.Labels.length != 0)
															{
																for(var k=0;k<r1.Labels.length;k++)
																	if(parseInt(r1.Labels[k].Confidence)>70)
																	str1 = str1.concat(r1.Labels[k].Name+", "); 
																
															}
															

															//Detect Celebrity Faces
															var r2 = JSON.parse(JSON.stringify(res2));
															var str2 = "";
															if(r2.CelebrityFaces.length != 0)
															{
																for(var k=0;k<r2.CelebrityFaces.length;k++)
																	str2 = str2.concat(r2.CelebrityFaces[k].Name+", "); 
				
															}
															
															
															
															var ep = new AWS.Endpoint('https://Translate.us-east-1.amazonaws.com');
															var translate = new AWS.Translate()
															translate.endpoint = ep;
															var t=str.concat("##99##").concat(str1).concat("**99**").concat(str2);

															var params = {
																Text: t,
																SourceLanguageCode: 'en',
																TargetLanguageCode: 'en'
															};

															translate.translateText(params, function (err, data) {
															console.log("ttext----******>>>>>"+JSON.stringify(err));
															var trans_t = data.TranslatedText;
															
																str=trans_t.substr(0,trans_t.indexOf("##99##"));
																str1=trans_t.substr(trans_t.indexOf("##99##")+6,trans_t.indexOf("**99**"));
																str2=trans_t.substr(trans_t.indexOf("**99**")+6,trans_t.length);
																
																str1=str1.split("**99**").join("");
																if(str.length < 2)
																	str=str.concat("         ");
																
																		var ep = new AWS.Endpoint('transcribe.us-east-1.amazonaws.com');
																		var comprehend = new AWS.Comprehend();
																		var params = {
																		LanguageCode: 'en',
																		TextList: [str]
																		};

																		comprehend.batchDetectKeyPhrases(params, function(err, data){
																		if (err)
																			console.log(err, err.stack);
																		else
																		{
																			var enlen = data['ResultList'][0]['KeyPhrases'].length;
																			for(var i=0;i<enlen;i++)
																			{
																			keyphrases[kp++] = data['ResultList'][0]['KeyPhrases'][i].Text;		
																			}
																			
																			text = text.concat(str).concat(". ");
																			labels = labels.concat(str1).concat(". ");
																			celebrity = celebrity.concat(str2).concat(". ");		
																		
																			cb();
																			

																		}
																		});
																
																
															});
															
															
															  

														});
													});

									});
								});
						}
						else
						{
							cb();
						}
                   
        }

        function process_arrays()
        {
            callback(three);
        }
	
	
	}
	
	function first(callback)
	{
		upload(req,res,function(err) {
			console.log(req.body);
			console.log(req.files);
			filenames[0]=req.files[0].originalname;
			filenames[1]=req.files[1].originalname;
			filenames[2]=req.files[2].originalname;
			
			callback(second);
		});
	}
	
	first(second);
});


app.get("/", function(req, res) {
    res.status(200).send("Welcome to Rakuten's RESTFUL Server");
});

app.get("/dataoperatorspace", (req, res) => {
	console.log("here..");
    res.render('dataoperatorspace');
});

app.get("/userspace", (req, res) => {
    res.render('userspace');
});

app.get("/admin", (req, res) => {
    res.render('admin');
});

app.get("/seller", (req, res) => {
    res.render('seller');
});

app.get("/addcategory/:cat", (req, res) => {
	
	var cat=req.params.cat;
	var result=",{\"name\":\""+cat+"\",\"subcat\":[]}";
	
	request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories?apiKey=wMQYkvf9YVpBoYT92w4ZNXJFGxVgY58x", function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				
								var res=JSON.parse(body);
								var id=res[0]._id.$oid;
								var temp=JSON.stringify(res[0].category);
								//console.log("\n"+temp);
								temp="{\"category\":".concat(temp.substr(0,temp.length - 1 )).concat(result).concat("]}");
								result=temp;
								//console.log("\n\n\n\n"+result);
								result=JSON.parse(result);
								
								request.delete("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories/" + id + "?apiKey=wMQYkvf9YVpBoYT92w4ZNXJFGxVgY58x", function(error, response, body) {
								if (!error && response.statusCode == 200) 
								{

										console.log("deleted...");
								
										request.post("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories?apiKey=wMQYkvf9YVpBoYT92w4ZNXJFGxVgY58x", {
										json: result
											},
											function(error, response, body) {
												if (!error && response.statusCode == 200) {
													console.log("----->" + JSON.stringify(body));
													
												} else
													console.log("-----XXXXX>" + JSON.stringify(response));
											}
										);
								   
								}
								});
				
				
			}
		});	
	
    res.status(200).send("Success!");
});


app.get("/addsubcategory/:cat/:subcat", (req, res) => {
	
	var cat=req.params.cat;
	var subcat=req.params.subcat;
	var result="{\"name\":\""+subcat+"\",\"brands\":[]}";
	var cats=new Array();
	var ct=0;
	
	var subcats=new Array();
	var sb=0;
	var temp="";
	
	request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories?apiKey=wMQYkvf9YVpBoYT92w4ZNXJFGxVgY58x", function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				
								var res=JSON.parse(body);
								var id=res[0]._id.$oid;
								for(var i=0;i<res[0].category.length;i++)
								{
										if(res[0].category[i].name==cat)
										{
											for(var j=0;j<res[0].category[i].subcat.length;j++)
											{
												temp=temp.concat(JSON.stringify(res[0].category[i].subcat[j]));
												
												temp=temp.concat(",");
											}
											temp=temp.concat(result);
										}
										else
										{
											cats[ct++]=JSON.stringify(res[0].category[i]);
										}
								}
								
								var temp1="{\"category\": [";
								for(var i=0;i<ct;i++)
								{
									temp1=temp1.concat(cats[i]);
									temp1=temp1.concat(",");
								}
								temp1=temp1.concat("{\"name\":\"").concat(cat).concat("\",\"subcat\":[").concat(temp).concat("]}");
								temp1=temp1.concat("]}");
								
								result=temp1;
								result=JSON.parse(temp1);
								
								console.log("======>"+result);
								request.delete("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories/" + id + "?apiKey=wMQYkvf9YVpBoYT92w4ZNXJFGxVgY58x", function(error, response, body) {
								if (!error && response.statusCode == 200) 
								{

										console.log("deleted...");
								
										request.post("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories?apiKey=wMQYkvf9YVpBoYT92w4ZNXJFGxVgY58x", {
										json: result
											},
											function(error, response, body) {
												if (!error && response.statusCode == 200) {
													console.log("----->" + JSON.stringify(body));
													
												} else
													console.log("-----XXXXX>" + JSON.stringify(response));
											}
										);
								   
								}
								});
				
				
			}
		});	
	
    res.status(200).send("Success!");
});

app.get("/addbrand/:cat/:subcat/:brand", (req, res) => {
	
	var cat=req.params.cat;
	var subcat=req.params.subcat;
	var brand=req.params.brand;
	var result="{\"name\":\""+brand+"\",\"products\":[]}";
	
	var cats=new Array();
	var ct=0;
	
	var subcats=new Array();
	var sb=0;
	
	var temp="";
	
	request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories?apiKey=wMQYkvf9YVpBoYT92w4ZNXJFGxVgY58x", function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				
								var res=JSON.parse(body);
								var id=res[0]._id.$oid;
								for(var i=0;i<res[0].category.length;i++)
								{
										if(res[0].category[i].name==cat)
										{
											
											for(var j=0;j<res[0].category[i].subcat.length;j++)
											{
												if(res[0].category[i].subcat[j].name==subcat)
												{
													
													for(var k=0;k<res[0].category[i].subcat[j].brands.length;k++)
													{
														temp=temp.concat(JSON.stringify(res[0].category[i].subcat[j].brands[k]));
														temp=temp.concat(",");
													
													}
													temp=temp.concat(result);
													
												}
												else
												{	
												subcats[sb++]=JSON.stringify(res[0].category[i].subcat[j]);
												}
											}
											
										}
										else
										{
											cats[ct++]=JSON.stringify(res[0].category[i]);
										}
								}
								
								var temp1="{\"category\": [";
								
								for(var i=0;i<ct;i++)
								{
									temp1=temp1.concat(cats[i]);
									temp1=temp1.concat(",");
								}
								
								temp1=temp1.concat("{\"name\":\"").concat(cat).concat("\",\"subcat\":[")
								
								
								for(var i=0;i<sb;i++)
								{
									temp1=temp1.concat(subcats[i]);
									temp1=temp1.concat(",")
								}
								temp1=temp1.concat("{\"name\":\"").concat(subcat).concat("\",\"brands\":[").concat(temp).concat("]}");
								temp1=temp1.concat("]}");
								temp1=temp1.concat("]}");
								
								
								
								
								result=temp1;
								result=JSON.parse(temp1);
								
								console.log("======>"+result);
								request.delete("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories/" + id + "?apiKey=wMQYkvf9YVpBoYT92w4ZNXJFGxVgY58x", function(error, response, body) {
								if (!error && response.statusCode == 200) 
								{

										console.log("deleted...");
								
										request.post("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories?apiKey=wMQYkvf9YVpBoYT92w4ZNXJFGxVgY58x", {
										json: result
											},
											function(error, response, body) {
												if (!error && response.statusCode == 200) {
													console.log("----->" + JSON.stringify(body));
													
												} else
													console.log("-----XXXXX>" + JSON.stringify(response));
											}
										);
								   
								}
								});
				
				
			}
		});	
	
    res.status(200).send("Success!");
});


app.get("/addproduct/:cat/:subcat/:brand/:proname/:prodesc/:proprice", (req, res) => {
	
	var cat=req.params.cat;
	var subcat=req.params.subcat;
	var brand=req.params.brand;
	var proname=req.params.proname;
	var prodesc=req.params.prodesc;
	var proprice=req.params.proprice;
	var url="http://localhost:3000/assets/images/bamboowindchain1.jpg";
	
	var result="{\"name\":\""+proname+"\",\"desc\":\""+prodesc+"\",\"price\":\""+proprice+"\",\"url\":\""+url+"\"}";
	
	var cats=new Array();
	var ct=0;
	
	var subcats=new Array();
	var sb=0;
	
	var brands=new Array();
	var bb=0;
	
	var temp="";
	
	request("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories?apiKey=wMQYkvf9YVpBoYT92w4ZNXJFGxVgY58x", function(error, response, body) {
			if (!error && response.statusCode == 200)
			{
				
								var res=JSON.parse(body);
								var id=res[0]._id.$oid;
								for(var i=0;i<res[0].category.length;i++)
								{
										if(res[0].category[i].name==cat)
										{
											
											for(var j=0;j<res[0].category[i].subcat.length;j++)
											{
												if(res[0].category[i].subcat[j].name==subcat)
												{
													
													for(var k=0;k<res[0].category[i].subcat[j].brands.length;k++)
													{
														
														if(res[0].category[i].subcat[j].brands[k].name==brand)
														{
															
															for(l=0;l<res[0].category[i].subcat[j].brands[k].products.length;l++)
															{
																temp=temp.concat(JSON.stringify(res[0].category[i].subcat[j].brands[k].products[l]));
																temp=temp.concat(",");
															}
															temp=temp.concat(result);
															
														}
														else
														brands[bb++]=JSON.stringify(res[0].category[i].subcat[j].brands[k]);
														
										
													
													}
													
													
												}
												else
												{	
												subcats[sb++]=JSON.stringify(res[0].category[i].subcat[j]);
												}
											}
											
										}
										else
										{
											cats[ct++]=JSON.stringify(res[0].category[i]);
										}
								}
								
								var temp1="{\"category\": [";
								
								for(var i=0;i<ct;i++)
								{
									temp1=temp1.concat(cats[i]);
									temp1=temp1.concat(",");
								}
								
								temp1=temp1.concat("{\"name\":\"").concat(cat).concat("\",\"subcat\":[")
								
								
								for(var i=0;i<sb;i++)
								{
									temp1=temp1.concat(subcats[i]);
									temp1=temp1.concat(",")
								}
								temp1=temp1.concat("{\"name\":\"").concat(subcat).concat("\",\"brands\":[");
								
								for(var i0;i<bb;i++)
								{
									temp1=temp1.concat(brands[i]);
									temp1=temp1.concat(",")
								}
								temp1=temp1.concat("{\"name\":\"").concat(brand).concat("\",\"products\":[").concat(temp).concat("]}");
								temp1=temp1.concat("]}");
								temp1=temp1.concat("]}");
								temp1=temp1.concat("]}");
								
								
								result=temp1;
								result=JSON.parse(temp1);
								
								console.log("======>"+result);
								request.delete("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories/" + id + "?apiKey=wMQYkvf9YVpBoYT92w4ZNXJFGxVgY58x", function(error, response, body) {
								if (!error && response.statusCode == 200) 
								{

										console.log("deleted...");
								
										request.post("https://api.mlab.com/api/1/databases/alexa_rakuten/collections/Product_Categories?apiKey=wMQYkvf9YVpBoYT92w4ZNXJFGxVgY58x", {
										json: result
											},
											function(error, response, body) {
												if (!error && response.statusCode == 200) {
													console.log("----->" + JSON.stringify(body));
													
												} else
													console.log("-----XXXXX>" + JSON.stringify(response));
											}
										);
								   
								}
								});
				
				
			}
		});	
	
    res.status(200).send("Success!");
});



module.exports = app;
