# Rakathon
AIRA - Software Solution for Next Generation E-commerce.<br>
<ul>
  <li><b>A </b>- Analytical Dashboard</li>
  <li><b>I </b>- Image Based</li>
  <li><b>R </b>- Recommender</li>
  <li><b>A </b>- Alexa Skill</li>
</ul>

<h2> Problem Statement:</h2>
The major problems that we were able to identify are as follows: 

<h3>1. Campaign Analyzer:</h3>
<ul>
<li>Every E-commerce firm runs campaigns on different social media websites in order to promote their flash sales or product launches under collaboration with other product companies.<br>
<li>Each of these social networking websites have got their own analytical dashboard in order to analyse how well the campaign is doing in terms of views, likes, dislikes, post reachability, unique visitors etc<br>
<li>But for the data analysts at the E-commerce firm it becomes difficult to collectively analyse the same which leads to the need of having a social analytical dashboard which could pull real time data from these websites and come up with the necessary data visualizations thus making it easier for the e-commerce firm.<br>
<li><b>Why there is a need of Unified Dashboard?</b><br>
<ul>
<li>It’s important to keep track of how well your campaigns are doing on different social media websites. Usually it might do good enough one but not on the other.</li>
<li>So, the firm needs to have insights on where the campaign is doing good to power their decisions in terms of where to put more money to promote their campaigns and how much!</li>
</ul>
</ul>

<h3>2.Image Based Recommendation:</h3>
<ul>
<li>Currently the process of searching on E-commerce websites is query based. Most of the internal search engines run on text-based queries and rely on the keywords or tags used with the product image in order to be picked up for the user.<br>
<li>The efficiency of such a model relies on the skill-level of the domain-expert who is responsible for providing the right set of keywords for every product’s image in the catalogue so that it gets picked up by the Recommendation Engine when the user issues a query on the user interface of the app/website of E-commerce firm.<br>
<li>We propose an Image based Recommender which will try to extract the product features from the multiple images of the product that are fed to it.<br>
<li>Why there is a need of Image based Recommender?<br>
<ul>
<li>Reduces the human intervention while uploading the catalogue of products to the website.</li>
<li>More accurate and precise recommendations.</li>
</ul>
</ul>

<h2>Proposed Solution:</h2>
As a unified software solution, we present the product AIRA (Analytical Dashboard + Image based Recommender + Alexa skill) Engine which consist of three software modules:<br>

<h3>1. SOFTWARE MODULE – CAMPAIGN ANALYZER:</h3><hr>
<ul>
<li>The social media websites that we are targeting are:<br>
<ul>  
<li>Youtube<br>
<li>Twitter<br>
<li>Facebook<br>
<li>Google analytics for the E-commerce website pages<br>
</ul>
<li>The Data Visualizations the dashboard will have are:<br><br>
<ul>

<li>Twitter Based:<br>
<ul>
<li>What are the Named Entities people are referring to while tweeting about your campaign (Named Entity Recognition).</li>
<li>What are the top positive and negative tweets about your campaign</li>
<li>Data visualisations depicting sentiment analysis about the campaign</li>
</ul>
</li>
<li>Youtube Based:<br>
<ul>
<li>Video Length v/s likes data visualisations</li>
<li>Views based data visualisations across different videos for the same campaign</li>
<li>Most Liked and Most disliked videos</li>
</ul>
</li>
<li>Facebook based:<br>
<ul>
<li>Likes distribution across posts.</li>
<li>Post Reachability</li>
<li>Most viewed posts</li>
</ul>
</li>
<li>Google Analytics based:<br>
<ul>
<li>Number of unique visitors for every page of the E-commerce Website.</li>
<li>Visitors plotted across time duration for every page.</li>
</ul>
</ul>
</li>
<li>Benefits of such a dashboard:</b><br>
<ul>

<li>To capture user’s journey from seeing the campaign advertisement to buying a product.</li>
<li>Aggregating and Summarising the data spread across different social networking websites.</li>
<li>Presenting the data insights in a meaningful and human-readable format thus making the job easier for management people.</li>
<li>Helping to solve questions like where to spend and how much to spend?</li>
<li>Calculating KPIs (Key Performance Indicator).</li>
</ul>

<li> <b>Architecture of the Software Module:</b><br>
  <img src="https://i.imgur.com/Sh1ewKn.png"><br>
   <img src="https://i.imgur.com/FaJzWCs.png">
<br>
 

<li> <b>Technology Stack:</b><br>
<ul>
<li><b>Data Aggregation (Data Source in above figure):</b> Twitter Streaming APIs, Youtube REST Reporting APIs, Facebook Graph APIs, Google Analytics data.</li>
<li><b>Data Analysis (Using AWS Analytics Services):</b> Amazon Kinesis as a data ingestion technology, S3 buckets for Storage, Athena for population data into tables and running queries.</li>
<li><b>Data Visualisation (Using AWS Quicksight):</b> It has got all kinds of different data visualisations to present data analysis in a human readable form and generate stories/dashboards for non-technical people.</li>
<li><b>Deployment: </b>AWS Cloud.</li>
</ul>
</ul>

<h3>2. SOFTWARE MODULE – IMAGE BASED RECOMMENDATION:</h3><hr>

There are two software sub-modules involved here namely:<br>


<h4>Catalogue Building Module:</h4>

<ul>
<li>This is the phase where in the data operator uploads multiple images of the product from the shopkeeper on the E-commerce website for sale. These photos include images of the actual product and packaging box.<br>
<li>The data operator does so via a User Interface which allows him to upload multiple images of a product.<br>
<li>Now for each of the image, we do the following:<br>
<ul>
<li>
<b>AWS-Rekognition Services</b> are applied to the image in order to extract the information contained in the image.<br>
<ul>
<li><b>detectLabels():</b> Detects the instances of real world entities in an image.<br></li>
<li><b>detectText(): </b>To extract the text present in images irrespective of the language. To extract information present on the packaging of the product.<br></li>
<li><b>recogniseCelebrities():</b> To identify if any celebrity is associated with the product whose image might be present on the packaging material.<br></li>
</ul>
</li>
<li><b>AWS-Translate Services</b> to translate the retrieved information into English Language.<br></li>
<li><b>AWS-Comprehend Services</b> to identify the keywords and Named Entities from translated information.<br></li>
   <ul>
     <li>detectKeyphrases() from extracted text.
     <li>detectedEntitites() from Extracted text.
  </ul>
</ul>
<li>Once the information is extracted from the images, the information extrcated gets stored in the database.<br>
<li>All this happens on a single click, when the data operator uploads the images of the product.<br>
</ul>

<h4>User Interaction Module:</h4>

<ul>
<li>Once we have augmented the images with the information contained in them, its time to use the same for generating the recommendations for the user.<br>
<li>The User interface is pretty simple wherein initially the user is presented with few random product images and once he expresses his interest by liking one of them, the clustering algorithm goes back to the database in order to find products with information similar to the one liked by the user.<br>


<li><b>Architecture of Catalogue Building Module:</b> <br>
<img src="https://i.imgur.com/aUpCnqI.png"><br>

<li><b>Design of the User Interface:</b><br>
<ul>
<li>The UI on the e-commerce website will be designed such that when the user expresses his interest towards a product by liking the image then the Recommendation Engine will perform a scan on the DB to find products whose keywords provide a good match against the product selected and those will be recommended to  the user.<br>
<li><h6>LDA - Latent Dirichlet Allocation Model : </h6></li>
  <ul>
    <li> Motivation : LDA is a topic modelling algorithm which tries to cluster images based on the extracted text from images.</li>
    <li> Outcome : Product images with similar textual descriptions</li>
  </ul>
  <li><h6>TF-IDF - TermFrequency - InverseDocumentFrequency Model : </h6></li>
  <ul>
    <li> Motivation : TF-IDF is a document clustering technique which tries to identify most similar documents to the sample document by generating vectorize representations and then using cosine similarity to measure similarity percentage.</li>
    <li>Outcome : Product images with similar textual descriptions</li>
     </ul>
  <li><h6>Elastic Search Engine : Running on a Single Node Cluster </h6></li>
  <ul>
    <li> Motivation : Using search() and multi_search() services of fast paced elastic search which is working on an index built on the catalog of products.</li>
    <li>Outcome : Product images with similar labels</li>
     </ul>
 </ul>

<li><b>Architecture of User Interface powered by Recommender:</b> <br>
  <img src="https://i.imgur.com/AYWtKcJ.png"><br>
 <li><b>User interface screenshots:</b> <br> <br>
 <img src="https://i.imgur.com/xsQMljU.png"><br>
   <img src="https://i.imgur.com/sTWohGR.png"><br>
 
<li><b>	Technology Stack:</b><br>
<ul>
  <li><b> Visual Recognition Tool  : NodeJS Project </b></li>
  <ul>
     <li>Server-Type : REST</li>
     <li>Programming Language : NodeJS with Express Framework (REST Server + Web App)</li>
     <li>App : NodeJS App</li>
     <li>Database : MongoDB hosted on MLAB </li>
     <li>Hosted : Localhost Server </li>
     <li>Major API Endpoint : http://localhost:3000/dataoperators/dataoperator</li>
    <li> 3rd Party APIs used : Aws Recognition Services like detectLabels(),detectText(),recogniseCelebrities(). AWS Translate Service,AWS Comprehend Service like detectKeyphrases() </li>
  </ul>
  <li><b> Recommendation Engine : Python Project</b></li>
  <ul>
     <li>Server-Type : Python Project (REST Server)</li>
     <li>Programming Language : Python</li>
     <li>App : Flask App</li>
     <li>Hosted : Localhost Server </li>
     <li>Database : MongoDB hosted on MLAB </li>
     <li>Major API Endpoint : http://localhost:5000/recommendations/labels/keyphrases/training_parameter</li>
    <li> Machine Learning Models used : LDA and TF-IDF along with the search queries powered by Elastic Search Engine</li>
  </ul> 
  <li><b> Elastic Search Engine - Lucene Based : Java Project</b></li>
  <ul>
     <li>Server-Type : Java Project (REST Server)</li>
     <li>Programming Language : Java</li>
     <li>App : Java web app</li>
     <li>Hosted : Single Node Cluster running on Localhost Server on port 9200</li>
     <li>Database : MongoDB hosted on MLAB </li>
     <li>Major API Endpoint : http://localhost:9200</li>
    <li> Search Queries : search() and multi_search() working on index built on top of catalog of products. /li>
  </ul> 
  </ul>  


<h3>3. SOFTWARE MODULE : Alexa Skill Voice based bargaing assistant for E-commerce</h3><hr>
<ul>
<li>With the advances in voice enabled devices like Amazon’s Echo and Google Home, the customers of these devices prefer using them for many purposes, but voice enabled shopping via ecommerce sites is an area still unexplored
<li>We propose to build an Alexa skill that will enable the user to buy products via ecommerce sites directly by using their Alexa enabled devices
<li>One of the major challenge in bringing the offline customers to online shopping is lack of bargain on ecommerce site, but our skill will remove that obstacle by giving voice chat enabled bargain feature based on a complex algorithm that will benefit both the customers and the ecommerce
  <li><b>Benefits of Alexa Skill for ecommerce?</b>
 <ul>   
<li>The skill will help the organization to target the growing customer base that possess voice enabled smart devices
<li>The bargain feature will help the organization to target the major sector of offline shoppers, that are reluctant to buy online by giving them the offline retail shop
<li>With the personalized conversation between Alexa and customer, the buyer will gain trust in the organization.  
    </ul>
  <li><b> Sample Intents </b>    
   <ul>
     <li>Checking Price of a Product
     <li>Checking cart details
     <li>Buying of goods
      <li>Cancelling of goods, asking for refund and return of goods
       <li>Checking Order Status
         <li>Bargain on the price offered. Bargaining algorithm takes folowing parameters into account while bargaining:
         <ul>
           <li>Frequent user : whther he has bought atleast 3 times in last one month
            <li>Product popularity: The product being bought is a best seller or not in the region user belongs to.
              <li>Seller Earnings : If seller has registered multiple units of that product and for quite some time not even a single unit has been sold.
         </ul>
   </ul>  
<li><b>	Technology Stack:</b><br>

  <ul>
     <li>Server-Type : REST</li>
     <li>Programming Language : NodeJS with Express Framework (REST Server + Web App)</li>
     <li>App : NodeJS App</li>
     <li>Database : MongoDB hosted on MLAB </li>
     <li>Hosted : AWS Lambda</li>
    <li> 3rd Party APIs used : MLAB APIs, Nexmo Messaging APIs, Node Mailer Emailing APIs, Google Maps APIs, Alexa Cards for Alexa App </li>
  </ul>  
</ul>  
  
<b>	Video Demonstration of alexa Conversation:</b><br> 
[![Watch the video](https://github.com/amitabh27/Rakathon/blob/master/repoMetadata/logo.png)](https://www.youtube.com/watch?v=EP5G0mf56pA&t=94s)
 
<ul> 
<li><b>	Architecture of Alexa Skill :</b><br>  
  <img src="https://i.imgur.com/bvUxRem.png"><br>
  <li><b>	Admin Dashboard of Alexa Skill :</b><br> <br>
    <img src="https://i.imgur.com/7AepC7G.png">
</ul>  

  

