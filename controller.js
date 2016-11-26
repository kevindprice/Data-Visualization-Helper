var questionNumber=0;
var questionBank=new Array();
var stage="#game1";
var stage2=new Object;
var questionLock=false;
var numberOfQuestions;
//var score=0;
var answers = [];

		 

		 

 
 		$.getJSON('activity.json', function(data) {

		for(i=0;i<data.quizlist.length;i++){ 
			questionBank[i]=new Array;
			questionBank[i][0]=data.quizlist[i].question;
			questionBank[i][1]=data.quizlist[i].option1;
			questionBank[i][2]=data.quizlist[i].option2;
			questionBank[i][3]=data.quizlist[i].option3;
		}
		 numberOfQuestions=questionBank.length; 
		
		 
		displayQuestion();
		})//gtjson
 
 

function resetQuiz(){
	answers = [];
	questionNumber = -1;
	questionLock=false;

	changeQuestion();
}
 
 


function displayQuestion(){
// var rnd=Math.random()*3;
//rnd=Math.ceil(rnd);
 rnd = 1;
 var q1;
 var q2;
 var q3;

 q1=questionBank[questionNumber][1];q2=questionBank[questionNumber][2];q3=questionBank[questionNumber][3];
//if(rnd==1){q1=questionBank[questionNumber][1];q2=questionBank[questionNumber][2];q3=questionBank[questionNumber][3];}
//if(rnd==2){q2=questionBank[questionNumber][1];q3=questionBank[questionNumber][2];q1=questionBank[questionNumber][3];}
//if(rnd==3){q3=questionBank[questionNumber][1];q1=questionBank[questionNumber][2];q2=questionBank[questionNumber][3];}

if(q3=="none") //two answer choices
{
	$(stage).append('<div class="questionText">'+questionBank[questionNumber][0]+'</div><div id="1" class="option">'+q1+'</div><div id="2" class="option">'+q2+'</div>');
}
else		//three answer choices
{
	$(stage).append('<div class="questionText">'+questionBank[questionNumber][0]+'</div><div id="1" class="option">'+q1+'</div><div id="2" class="option">'+q2+'</div><div id="3" class="option">'+q3+'</div>');
}


 $('.option').click(function(){
  if(questionLock==false){questionLock=true;	
  //correct answer
/*  if(this.id==rnd){
   $(stage).append('<div class="feedback1">CORRECT</div>');
   score++;
   }
  //wrong answer	
  if(this.id!=rnd){
   $(stage).append('<div class="feedback2">WRONG</div>');
  } */
  
  answers.push(this.id);
  
  setTimeout(function(){changeQuestion()},500);
 }})
}//display question

	
	
	
	
	
	function changeQuestion(){
		
//		questionNumber++;
	
	questionNumber = getQuestionNumber();
	
	if(stage=="#game1"){stage2="#game1";stage="#game2";}
		else{stage2="#game2";stage="#game1";}
	
	if(questionNumber<numberOfQuestions){displayQuestion();}else{displayFinalSlide();}
	
	 $(stage2).animate({"right": "+=800px"},"slow", function() {$(stage2).css('right','-800px');$(stage2).empty();});
	 $(stage).animate({"right": "+=800px"},"slow", function() {questionLock=false;});
	}//change question
	
	
	
	
	function getQuestionNumber(){
		/*Question logic:
		
		Also need to record answers as they are given.
		
		1: if 1, go to 2. If 2, go to 3.
		2: finish survey. If 1, OPTION SET 1. If 2, OPTION SET 2.
		3: if 1, go to 5. If 2, go to 6. If 3, go to 4.
		4: finish survey. If 1, OPTION SET 3. If 2, OPTION SET 4. If 3, OPTION SET 5.
		5: Go to Q 7  (???)  If 1 also go to 10.
		6: Go to Q 7  (???)  If 1 or 3, also go to 11.
		7: If 1, go to 8. If 2 or 3+, go to 9.
		*/
		
		//value of 20 means done with survey.
		
		//questionNumber starts at 0
		switch(questionNumber) { 
		case -1:
			return 0;  //if the "reset quiz" button is pushed
		case 0:
			if(answers[answers.length - 1] == 1)
			{ return 1; }
			else if(answers[answers.length - 1] == 2)
			{ return 2; }
		case 1: //survey ends
			if(answers[answers.length - 1] == 1)
			{ return 20; }
			else if(answers[answers.length - 1] == 2)
			{ return 20; }
		case 2:
			if(answers[answers.length - 1] == 1)
			{ return 4; }
			else if(answers[answers.length - 1] == 2)
			{ return 5; }
			else if(answers[answers.length - 1] == 3)
			{ return 3; }
		case 3: //survey ends
			if(answers[answers.length - 1] == 1)
			{ return 20; }
			else if(answers[answers.length - 1] == 2)
			{ return 20; }
			else if(answers[answers.length - 1] == 3)
			{ return 20; }
		case 4:
		case 5:
			return 6;
		case 6:
			if(answers[answers.length - 1] == 1)
			{ return 7; }
			else if(answers[answers.length - 1] == 2)
			{ return 8; }
			else if(answers[answers.length - 1] == 3)
			{ return 8; }
		case 7:
		case 8:
			//"Categorical" on question 5
			if(answers[0]==2 && answers[1]==1 && answers[2]==1)
			{ return 9; }

			//"All Categorical" or "Mixed" on question 6
			if(answers[0]==2 && answers[1]==2 && (answers[2]==1 || answers[2]==3) )
			{ return 10; }
		}
	//If the switch statement didn't return anything,
	//that means the user is done with the survey and needs
	//to go to the correct option set.
		return 20;

	
	}
	

	
	
	function displayFinalSlide(){
		
		$(stage).append('<div class="answerText">For your data:<br>' + getResult() +'<br>'+'</div>');
		
	}//display final slide
	


//This function parses the user answers and splits to different option sets.
//All options are accounted for.
function getResult(){

/////////////////////////////////////////////////
///////Etc...////////////////////

		//*1 var, var is categorical
		if(answers[0]==1 && answers[1]==1)
		{ return "<br>Best graphs: Bar chart, pie chart"; }
		
		//1 var, var is continuous
		if(answers[0]==1 && answers[1]==2)
		{ return "<br>Best graphs: Histogram, density plot<br>"
				+ "Also consider: Box plot, violin plot<br>"
				+ "Matching statistic: One-sample t-test"; }
		
		//2+ vars, all/none are dependent,all categorical
		if(answers[0]==2 && answers[1]==3 && answers[2]==1)
		{ return "<br>Best graphs: Your variables cannot be simultaneously visualized in a single graph. Consider using multiple bar charts or pie charts.<br><br>Also consider: Bar chart, pie chart"; }
		
		//2+ vars, all/none are dependent,all continuous
		if(answers[0]==2 && answers[1]==3 && answers[2]==2)
		{ return "<p style='text-indent:-.15in;'>Best graphs:<br>If you want to show correlations between variables: Quilt plot, association network<br>If you want to show distributions of each variable, consider using multiple histograms, density plots, box plots, or violin plots</p><p style='text-indent:-.15in;'>Also consider: Histogram, density plot, box plot, violin plot</p><p style='text-indent:-.15in;'>Matching statistic: Correlation matrix</p>"; }
		
		//2+ vars, all/none are dependent,mixed
		if(answers[0]==2 && answers[1]==3 && answers[2]==3)
		{ return "<p style='text-indent:-.15in;'>Best graphs: Your variables cannot be simultaneously visualized in a single graph. Consider using a combination of histograms, density plots, box plots, or violin plots (for continuous variables) and bar charts or pie charts (for categorical variables).</p><p style='text-indent:-.15in;'>Also consider: Histogram, density plot, box plot, violin plot, bar chart, pie chart</p>"; }
		
		
/////////////////////////////////////////////////
///////1 Dependent Variable////////////////////

	//dependent variable is categorical...
	
		//1 independent variable...
		
		//2+ vars, 1 dep, dep is cat,1 ind,ind is cat,dep 2 levels
			//(1)categorical --> (1)categorical, 2 levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==1 && answers[4]==1 && answers[5]==1 )
		{ return "Best graphs: Logistic line plot, mosaic plot<br><br>Matching statistic: Chi square, logistic regression (repeated measures)"; }

		//2+ vars, 1 dep, dep is cat,1 ind,ind is cat,dep 3+ levels
			//(1)categorical --> (1)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==1 && answers[4]==1 && answers[5]==2 )
		{ return "Best graphs: Mosaic plot<br><br>Matching statistic: Chi square"; }

		//2+ vars, 1 dep, dep is cat,1 ind,ind is cont,dep 2 levels
			//(1)continuous --> (1)categorical, 2 levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==1 && answers[4]==2 && answers[5]==1 )
		{ return "Best graphs: Logistic scatterplot<br>Also consider: Line plot<br>Matching statistic: Logistic regression (simple)"; }
	
		//2+ vars, 1 dep, dep is cat,1 ind,ind is cont,dep 3+ levels
			//(1)continuous --> (1)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==1 && answers[4]==2 && answers[5]==2 )
		{ return "Matching statistic: Logistic regression (multinomial)"; }


		//2 independent variables... /////////////////

		
		//2+ vars, 1 dep, dep is cat,2 ind,ind is cat,dep 2 levels
			//(2)categorical --> (1)categorical, 2 levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==2 && answers[4]==1 && answers[5]==1 )
		{ return "Best graphs: Logistic interaction plot<br>Matching statistic: Logistic regression (factorial)"; }

		//2+ vars, 1 dep, dep is cat,2 ind,ind is cat,dep 3+ levels
			//(2)categorical --> (1)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==2 && answers[4]==1 && answers[5]==2 )
		{ return "Matching statistic: Logistic regression (factorial)"; }

		//2+ vars, 1 dep, dep is cat,2 ind,ind is cont,dep 2 levels
			//(2)continuous --> (1)categorical, 2 levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==2 && answers[4]==2 && answers[5]==1 )
		{ return "Best graphs: 3D logistic scatterplot<br><br>Also consider: By breaking up one of your continuous variables into a categorical variable, you can use a logistic interaction plot<br><br>Matching statistic: Logistic regression (multiple)"; }
	
		//2+ vars, 1 dep, dep is cat,2 ind,ind is cont,dep 3+ levels
			//(2)continuous --> (1)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==2 && answers[4]==2 && answers[5]==2 )
		{ return "Impossible to graph"; }

		//2+ vars, 1 dep, dep is cat,2 ind,ind is mixed,dep 2 levels
			//(2)mixed --> (1)categorical, 2 levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==2 && answers[4]==3 && answers[5]==1 )
		{ return "Best graphs: Logistic interaction plot<br>Matching statistic: Logistic regression (multiple)"; }
	
		//2+ vars, 1 dep, dep is cat,2 ind,ind is mixed,dep 3+ levels
			//(2)mixed --> (1)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==2 && answers[4]==3 && answers[5]==2 )
		{ return "Matching statistic: Logistic regression (multiple)"; }	
	

		//3+ independent variables... /////////////////

		
		//?????2+ vars, 1 dep, dep is cat,3+ ind,ind is cat,dep 2 levels
			//(3+)categorical --> (1)categorical, 2 levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==3 && answers[4]==1 && answers[5]==1 )
		{ return "(3+)categorical --> (1)categorical, 2 levels"; }

		//?????2+ vars, 1 dep, dep is cat,3+ ind,ind is cat,dep 3+ levels
			//(3+)categorical --> (1)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==3 && answers[4]==1 && answers[5]==2 )
		{ return "(3+)categorical --> (1)categorical, 3+ levels"; }

		//2+ vars, 1 dep, dep is cat,3+ ind,ind is cont,dep 2 levels
			//(3+)continuous --> (1)categorical, 2 levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==3 && answers[4]==2 && answers[5]==1 )
		{ return "Best graphs: “Your variables cannot be simultaneously visualized in a single graph. Consider using a combination of the following:” Logistic scatterplot, logistic interaction plot<br>Also consider: 3D logistic scatterplot, 3D logistic interaction plot<br>Matching statistic: Logistic regression (multiple)"; }
	
		//2+ vars, 1 dep, dep is cat,3+ ind,ind is cont,dep 3+ levels
			//(3+)continuous --> (1)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==3 && answers[4]==2 && answers[5]==2 )
		{ return "Matching statistic: Logistic regression (multiple)"; }

		//2+ vars, 1 dep, dep is cat,3+ ind,ind is mixed,dep 2 levels
			//(3+)mixed --> (1)categorical, 2 levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==3 && answers[4]==3 && answers[5]==1 )
		{ return "Best graphs: If you have two continuous variables and one categorical variable: 3D logistic interaction plot<br><br>Also consider: Otherwise, your variables cannot be simultaneously visualized in a single graph. Consider using a combination of the following: Logistic scatterplot, logistic interaction plot, mosaic plot, 3D logistic scatterplot, 3D logistic interaction plot<br><br>Matching statistic: Logistic regression (multiple)"; }
	
		//2+ vars, 1 dep, dep is cat,3+ ind,ind is mixed,dep 3+ levels
			//(3+)mixed --> (1)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==3 && answers[4]==3 && answers[5]==2 )
		{ return "Matching statistic: Logistic regression (multiple)"; }	
	
	
	
	//dependent variable is continuous...
	
		
		//2+ vars, 1 dep, dep is cont,1 ind,ind is cat
			//(1)categorical --> (1)continuous
		if(answers[0]==2 && answers[1]==1 && answers[2]==2 && answers[3]==1 && answers[4]==1)
		{ return "Best graphs: Line plot<br>Also consider: Multiple box plot, multiple violin plot<br>Matching statistic: ANOVA (one-way), t-test"; }

		//2+ vars, 1 dep, dep is cont,1 ind,ind is cont
			//(1)continuous --> (1)continuous
		if(answers[0]==2 && answers[1]==1 && answers[2]==2 && answers[3]==1 && answers[4]==2)
		{ return "Best graphs: Scatterplot<br>Matching statistic: Linear regression (simple)"; }


		//2 independent variables...////////////////
		
		
		//2+ vars, 1 dep, dep is cont,2 ind,ind is cat
			//(2)categorical --> (1)continuous
		if(answers[0]==2 && answers[1]==1 && answers[2]==2 && answers[3]==2 && answers[4]==1)
		{ return "Best graphs: Interaction plot (1)<br>Also consider: Multiple box plot, multiple violin plot<br>Matching statistic: ANOVA (two-way)"; }

		//2+ vars, 1 dep, dep is cont,2 ind,ind is cont
			//(2)continuous --> (1)continuous
		if(answers[0]==2 && answers[1]==1 && answers[2]==2 && answers[3]==2 && answers[4]==2)
		{ return "Best graphs: “By breaking down one of your continuous variables into categories, you can use an interaction plot. This is probably the most common method for plotting your set of variables.” Interaction plot (2) “ To plot your data in a single graph, use:” 3D Scatterplot (1)<br><br>Also consider: Scatterplot<br><br>Matching statistic: Linear regression (multiple)"; }
	
		//2+ vars, 1 dep, dep is cont,2 ind,ind is mixed
			//(2)mixed --> (1)continuous
		if(answers[0]==2 && answers[1]==1 && answers[2]==2 && answers[3]==2 && answers[4]==3)
		{ return "Best graphs: Interaction plot (2)<br>Matching statistic: ANCOVA, Linear regression (multiple)"; }
	
	
		//3+ independent variables...////////////////
		
		
		//2+ vars, 1 dep, dep is cont,3+ ind,ind is cat
			//(3+)categorical --> (1)continuous
		if(answers[0]==2 && answers[1]==1 && answers[2]==2 && answers[3]==3 && answers[4]==1)
		{ return "Best graphs: Interaction plot (3)<br>Also consider: Multiple box plot, multiple violin plot<br>Matching statistic: ANOVA (3-way+)"; }

		//2+ vars, 1 dep, dep is cont,3+ ind,ind is cont
			//(3+)continuous --> (1)continuous
		if(answers[0]==2 && answers[1]==1 && answers[2]==2 && answers[3]==3 && answers[4]==2)
		{ return "Best graphs: Your variables cannot be simultaneously visualized in a single graph. We suggest using multiple graphs to visualize your data: use scatterplots to visualize the relationship between each IV and your DV, and use two-way interaction plots to visualize each two-way interaction. Scatterplot, interaction plot (2)<br><br>Matching statistic: Linear regression (multiple)"; }
	
		//2+ vars, 1 dep, dep is cont,3+ ind,ind is mixed
			//(3+)mixed --> (1)continuous
		if(answers[0]==2 && answers[1]==1 && answers[2]==2 && answers[3]==3 && answers[4]==3)
		{ return "Also consider: If you have 1 continuous and 2-3 categorical independent variables, we suggest Interaction plot (3) If you have 2 continuous and 1 categorical independent variables, we suggest: 3D interaction plot"; }
	
	

/////////////////////////////////////////////////
///////2+ Dependent Variables////////////////////
	
	//dependent variables are categorical...
	
		//1 independent variable...
		
		//2+ vars, 2 dep, dep is cat,1 ind,ind is cat,dep 2 levels
			//(1)categorical --> (2+)categorical, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==1 && answers[4]==1 && answers[5]==1 )
		{ return "Best graphs: “We suggest visualizing your data by splitting your analysis into two graphs (one for each dependent variable). Then use a mosaic plot or a logistic line plot for each one” Mosaic plot, logistic line plot<br><br>Matching statistic: MANOVA (one-way)"; }

		//2+ vars, 2 dep, dep is cat,1 ind,ind is cat,dep 3+ levels
			//(1)categorical --> (2+)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==1 && answers[4]==1 && answers[5]==2 )
		{ return "Best graphs: We suggest visualizing your data by splitting your results between two mosaic plots (one for each dependent variable) Mosaic plot<br><br>Matching statistic: MANOVA (one-way)"; }

		//?????2+ vars, 2 dep, dep is cat,1 ind,ind is cont,dep 2 levels
			//(1)continuous --> (2+)categorical, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==1 && answers[4]==2 && answers[5]==1 )
		{ return "(1)continuous --> (2+)categorical, 2 levels"; }
	
		//?????2+ vars, 2 dep, dep is cat,1 ind,ind is cont,dep 3+ levels
			//(1)continuous --> (2+)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==1 && answers[4]==2 && answers[5]==2 )
		{ return "(1)continuous --> (2+)categorical, 3+ levels"; }


		//2 independent variables... /////////////////

		
		//2+ vars, 2 dep, dep is cat,2 ind,ind is cat,dep 2 levels
			//(2)categorical --> (2+)categorical, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==2 && answers[4]==1 && answers[5]==1 )
		{ return "(2)categorical --> (2+)categorical, 2 levels"; }

		//2+ vars, 2 dep, dep is cat,2 ind,ind is cat,dep 3+ levels
			//(2)categorical --> (2+)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==2 && answers[4]==1 && answers[5]==2 )
		{ return "(2)categorical --> (2+)categorical, 3+ levels"; }

		//2+ vars, 2 dep, dep is cat,2 ind,ind is cont,dep 2 levels
			//(2)continuous --> (2+)categorical, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==2 && answers[4]==2 && answers[5]==1 )
		{ return "(2)continuous --> (2+)categorical, 2 levels"; }
	
		//2+ vars, 2 dep, dep is cat,2 ind,ind is cont,dep 3+ levels
			//(2)continuous --> (2+)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==2 && answers[4]==2 && answers[5]==2 )
		{ return "(2)continuous --> (2+)categorical, 3+ levels"; }

		//2+ vars, 2 dep, dep is cat,2 ind,ind is mixed,dep 2 levels
			//(2)mixed --> (2+)categorical, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==2 && answers[4]==3 && answers[5]==1 )
		{ return "(2)mixed --> (2+)categorical, 2 levels"; }
	
		//2+ vars, 2 dep, dep is cat,2 ind,ind is mixed,dep 3+ levels
			//(2)mixed --> (2+)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==2 && answers[4]==3 && answers[5]==2 )
		{ return "(2)mixed --> (2+)categorical, 3+ levels"; }
	
		
		//3+ independent variables... /////////////////

		
		//2+ vars, 2 dep, dep is cat,3+ ind,ind is cat,dep 2 levels
			//(3+)categorical --> (2+)categorical, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==3 && answers[4]==1 && answers[5]==1 )
		{ return "(3+)categorical --> (2+)categorical, 2 levels"; }

		//2+ vars, 2 dep, dep is cat,3+ ind,ind is cat,dep 3+ levels
			//(3+)categorical --> (2+)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==3 && answers[4]==1 && answers[5]==2 )
		{ return "(3+)categorical --> (2+)categorical, 3+ levels"; }

		//2+ vars, 2 dep, dep is cat,3+ ind,ind is cont,dep 2 levels
			//(3+)continuous --> (2+)categorical, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==3 && answers[4]==2 && answers[5]==1 )
		{ return "(3+)continuous --> (2+)categorical, 2 levels"; }
	
		//2+ vars, 2 dep, dep is cat,3+ ind,ind is cont,dep 3+ levels
			//(3+)continuous --> (2+)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==3 && answers[4]==2 && answers[5]==2 )
		{ return "(3+)continuous --> (2+)categorical, 3+ levels"; }

		//2+ vars, 2 dep, dep is cat,3+ ind,ind is mixed,dep 2 levels
			//(3+)mixed --> (2+)categorical, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==3 && answers[4]==3 && answers[5]==1 )
		{ return "(3+)mixed --> (2+)categorical, 2 levels"; }
	
		//2+ vars, 2 dep, dep is cat,3+ ind,ind is mixed,dep 3+ levels
			//(3+)mixed --> (2+)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==3 && answers[4]==3 && answers[5]==2 )
		{ return "(3+)mixed --> (2+)categorical, 3+ levels"; }
	
	
	
	
	//dependent variables are continuous...
	
		
		//2+ vars, 2 dep, dep is cont,1 ind,ind is cat
			//(1)categorical --> (2+)continuous
		if(answers[0]==2 && answers[1]==2 && answers[2]==2 && answers[3]==1 && answers[4]==1)
		{ return "(1)categorical --> (2+)continuous"; }

		//2+ vars, 2 dep, dep is cont,1 ind,ind is cont
			//(1)continuous --> (2+)continuous
		if(answers[0]==2 && answers[1]==2 && answers[2]==2 && answers[3]==1 && answers[4]==2)
		{ return "(1)continuous --> (2+)continuous"; }


		//2 independent variables...////////////////
		
		
		//2+ vars, 2 dep, dep is cont,2 ind,ind is cat
			//(2)categorical --> (2+)continuous
		if(answers[0]==2 && answers[1]==2 && answers[2]==2 && answers[3]==2 && answers[4]==1)
		{ return "(2)categorical --> (2+)continuous"; }

		//2+ vars, 2 dep, dep is cont,2 ind,ind is cont
			//(2)continuous --> (2+)continuous
		if(answers[0]==2 && answers[1]==2 && answers[2]==2 && answers[3]==2 && answers[4]==2)
		{ return "(2)continuous --> (2+)continuous"; }
	
		//2+ vars, 2 dep, dep is cont,2 ind,ind is mixed
			//(2)mixed --> (2+)continuous
		if(answers[0]==2 && answers[1]==2 && answers[2]==2 && answers[3]==2 && answers[4]==3)
		{ return "(2)mixed --> (2+)continuous"; }

	
		//3+ independent variables...////////////////
		
		
		//2+ vars, 2 dep, dep is cont,3+ ind,ind is cat
			//(3+)categorical --> (2+)continuous
		if(answers[0]==2 && answers[1]==2 && answers[2]==2 && answers[3]==3 && answers[4]==1)
		{ return "(3+)categorical --> (2+)continuous"; }

		//2+ vars, 2 dep, dep is cont,3+ ind,ind is cont
			//(3+)continuous --> (2+)continuous
		if(answers[0]==2 && answers[1]==2 && answers[2]==2 && answers[3]==3 && answers[4]==2)
		{ return "(3+)continuous --> (2+)continuous"; }
	
		//2+ vars, 2 dep, dep is cont,3+ ind,ind is mixed
			//(3+)mixed --> (2+)continuous
		if(answers[0]==2 && answers[1]==2 && answers[2]==2 && answers[3]==3 && answers[4]==3)
		{ return "(3+)mixed --> (2+)continuous"; }

	
	
	
	//dependent variables are mixed...
	
	
		//1 independent variable...
		
		//2+ vars, 2 dep, dep is mixed,1 ind,ind is cat,dep 2 levels
			//(1)categorical --> (2+)mixed, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==1 && answers[4]==1 && answers[5]==1 )
		{ return "(1)categorical --> (2+)mixed, 2 levels"; }

		//2+ vars, 2 dep, dep is mixed,1 ind,ind is cat,dep 3+ levels
			//(1)categorical --> (2+)mixed, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==1 && answers[4]==1 && answers[5]==2 )
		{ return "(1)categorical --> (2+)mixed, 3+ levels"; }

		//2+ vars, 2 dep, dep is mixed,1 ind,ind is cont,dep 2 levels
			//(1)continuous --> (2+)mixed, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==1 && answers[4]==2 && answers[5]==1 )
		{ return "(1)continuous --> (2+)mixed, 2 levels"; }
	
		//2+ vars, 2 dep, dep is mixed,1 ind,ind is cont,dep 3+ levels
			//(1)continuous --> (2+)mixed, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==1 && answers[4]==2 && answers[5]==2 )
		{ return "(1)continuous --> (2+)mixed, 3+ levels"; }


		//2 independent variables... /////////////////

		
		//2+ vars, 2 dep, dep is mixed,2 ind,ind is cat,dep 2 levels
			//(2)categorical --> (2+)mixed, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==2 && answers[4]==1 && answers[5]==1 )
		{ return "(2)categorical --> (2+)mixed, 2 levels"; }

		//2+ vars, 2 dep, dep is mixed,2 ind,ind is cat,dep 3+ levels
			//(2)categorical --> (2+)mixed, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==2 && answers[4]==1 && answers[5]==2 )
		{ return "(2)categorical --> (2+)mixed, 3+ levels"; }

		//2+ vars, 2 dep, dep is mixed,2 ind,ind is cont,dep 2 levels
			//(2)continuous --> (2+)mixed, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==2 && answers[4]==2 && answers[5]==1 )
		{ return "(2)continuous --> (2+)mixed, 2 levels"; }
	
		//2+ vars, 2 dep, dep is mixed,2 ind,ind is cont,dep 3+ levels
			//(2)continuous --> (2+)mixed, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==2 && answers[4]==2 && answers[5]==2 )
		{ return "(2)continuous --> (2+)mixed, 3+ levels"; }

		//2+ vars, 2 dep, dep is mixed,2 ind,ind is mixed,dep 2 levels
			//(2)mixed --> (2+)mixed, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==2 && answers[4]==3 && answers[5]==1 )
		{ return "(2)mixed --> (2+)mixed, 2 levels"; }
	
		//2+ vars, 2 dep, dep is mixed,2 ind,ind is mixed,dep 3+ levels
			//(2)mixed --> (2+)mixed, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==2 && answers[4]==3 && answers[5]==2 )
		{ return "(2)mixed --> (2+)mixed, 3+ levels"; }
		
		
		
		//3+ independent variables... /////////////////

		
		//2+ vars, 2 dep, dep is mixed,3+ ind,ind is cat,dep 2 levels
			//(3+)categorical --> (2+)mixed, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==3 && answers[4]==1 && answers[5]==1 )
		{ return "(3+)categorical --> (2+)mixed, 2 levels"; }

		//2+ vars, 2 dep, dep is mixed,3+ ind,ind is cat,dep 3+ levels
			//(3+)categorical --> (2+)mixed, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==3 && answers[4]==1 && answers[5]==2 )
		{ return "(3+)categorical --> (2+)mixed, 3+ levels"; }

		//2+ vars, 2 dep, dep is mixed,3+ ind,ind is cont,dep 2 levels
			//(3+)continuous --> (2+)mixed, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==3 && answers[4]==2 && answers[5]==1 )
		{ return "(3+)continuous --> (2+)mixed, 2 levels"; }
	
		//2+ vars, 2 dep, dep is mixed,3+ ind,ind is cont,dep 3+ levels
			//(3+)continuous --> (2+)mixed, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==3 && answers[4]==2 && answers[5]==2 )
		{ return "(3+)continuous --> (2+)mixed, 3+ levels"; }

		//2+ vars, 2 dep, dep is mixed,3+ ind,ind is mixed,dep 2 levels
			//(3+)mixed --> (2+)mixed, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==3 && answers[4]==3 && answers[5]==1 )
		{ return "(3+)mixed --> (2+)mixed, 2 levels"; }
	
		//2+ vars, 2 dep, dep is mixed,3+ ind,ind is mixed,dep 3+ levels
			//(3+)mixed --> (2+)mixed, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==3 && answers[4]==3 && answers[5]==2 )
		{ return "(3+)mixed --> (2+)mixed, 3+ levels"; }
		
		
		
	}
	
	