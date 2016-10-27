$(document).ready(function () {
	
var questionNumber=0;
var questionBank=new Array();
var stage="#game1";
var stage2=new Object;
var questionLock=false;
var numberOfQuestions;
var score=0;
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
		
		//questionNumber starts at 0
		switch(questionNumber) { 
		case 0:
			if(answers[answers.length - 1] == 1)
			{ return 1; }
			else if(answers[answers.length - 1] == 2)
			{ return 2; }
		case 1: //survey ends
			if(answers[answers.length - 1] == 1)
			{ return 21; }
			else if(answers[answers.length - 1] == 2)
			{ return 22; }
		case 2:
			if(answers[answers.length - 1] == 1)
			{ return 4; }
			else if(answers[answers.length - 1] == 2)
			{ return 5; }
			else if(answers[answers.length - 1] == 3)
			{ return 3; }
		case 3: //survey ends
			if(answers[answers.length - 1] == 1)
			{ return 23; }
			else if(answers[answers.length - 1] == 2)
			{ return 24; }
			else if(answers[answers.length - 1] == 3)
			{ return 25; }
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
	
	//dependent variable is categorical...
	
		//1 independent variable...
		
		//2+ vars, 1 dep, dep is cat,1 ind,ind is cat,dep 2 levels
			//(1)categorical --> (1)categorical, 2 levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==1 && answers[4]==1 && answers[5]==1 )
		{ return 26; }

		//2+ vars, 1 dep, dep is cat,1 ind,ind is cat,dep 3+ levels
			//(1)categorical --> (1)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==1 && answers[4]==1 && answers[5]==2 )
		{ return 27; }

		//2+ vars, 1 dep, dep is cat,1 ind,ind is cont,dep 2 levels
			//(1)continuous --> (1)categorical, 2 levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==1 && answers[4]==2 && answers[5]==1 )
		{ return 28; }
	
		//2+ vars, 1 dep, dep is cat,1 ind,ind is cont,dep 3+ levels
			//(1)continuous --> (1)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==1 && answers[4]==2 && answers[5]==2 )
		{ return 29; }


		//2 independent variables... /////////////////

		
		//2+ vars, 1 dep, dep is cat,2 ind,ind is cat,dep 2 levels
			//(2)categorical --> (1)categorical, 2 levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==2 && answers[4]==1 && answers[5]==1 )
		{ return 30; }

		//2+ vars, 1 dep, dep is cat,2 ind,ind is cat,dep 3+ levels
			//(2)categorical --> (1)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==2 && answers[4]==1 && answers[5]==2 )
		{ return 31; }

		//2+ vars, 1 dep, dep is cat,2 ind,ind is cont,dep 2 levels
			//(2)continuous --> (1)categorical, 2 levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==2 && answers[4]==2 && answers[5]==1 )
		{ return 32; }
	
		//2+ vars, 1 dep, dep is cat,2 ind,ind is cont,dep 3+ levels
			//(2)continuous --> (1)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==2 && answers[4]==2 && answers[5]==2 )
		{ return 33; }

		//2+ vars, 1 dep, dep is cat,2 ind,ind is mixed,dep 2 levels
			//(2)mixed --> (1)categorical, 2 levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==2 && answers[4]==3 && answers[5]==1 )
		{ return 34; }
	
		//2+ vars, 1 dep, dep is cat,2 ind,ind is mixed,dep 3+ levels
			//(2)mixed --> (1)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==1 && answers[2]==1 && answers[3]==2 && answers[4]==3 && answers[5]==2 )
		{ return 35; }	
	
	
	//dependent variable is continuous...
	
		
		//2+ vars, 1 dep, dep is cont,1 ind,ind is cat
			//(1)categorical --> (1)continuous
		if(answers[0]==2 && answers[1]==1 && answers[2]==2 && answers[3]==1 && answers[4]==1)
		{ return 36; }

		//2+ vars, 1 dep, dep is cont,1 ind,ind is cont
			//(1)continuous --> (1)continuous
		if(answers[0]==2 && answers[1]==1 && answers[2]==2 && answers[3]==1 && answers[4]==2)
		{ return 37; }


		//2 independent variables...////////////////
		
		
		//2+ vars, 1 dep, dep is cont,2 ind,ind is cat
			//(2)categorical --> (1)continuous
		if(answers[0]==2 && answers[1]==1 && answers[2]==2 && answers[3]==2 && answers[4]==1)
		{ return 38; }

		//2+ vars, 1 dep, dep is cont,2 ind,ind is cont
			//(2)continuous --> (1)continuous
		if(answers[0]==2 && answers[1]==1 && answers[2]==2 && answers[3]==2 && answers[4]==2)
		{ return 39; }
	
		//2+ vars, 1 dep, dep is cont,2 ind,ind is mixed
			//(2)mixed --> (1)continuous
		if(answers[0]==2 && answers[1]==1 && answers[2]==2 && answers[3]==2 && answers[4]==3)
		{ return 40; }

/////////////////////////////////////////////////
///////2+ Dependent Variables////////////////////
	
	//dependent variables are categorical...
	
		//1 independent variable...
		
		//2+ vars, 2 dep, dep is cat,1 ind,ind is cat,dep 2 levels
			//(1)categorical --> (2+)categorical, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==1 && answers[4]==1 && answers[5]==1 )
		{ return 41; }

		//2+ vars, 2 dep, dep is cat,1 ind,ind is cat,dep 3+ levels
			//(1)categorical --> (2+)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==1 && answers[4]==1 && answers[5]==2 )
		{ return 42; }

		//2+ vars, 2 dep, dep is cat,1 ind,ind is cont,dep 2 levels
			//(1)continuous --> (2+)categorical, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==1 && answers[4]==2 && answers[5]==1 )
		{ return 43; }
	
		//2+ vars, 2 dep, dep is cat,1 ind,ind is cont,dep 3+ levels
			//(1)continuous --> (2+)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==1 && answers[4]==2 && answers[5]==2 )
		{ return 44; }


		//2 independent variables... /////////////////

		
		//2+ vars, 2 dep, dep is cat,2 ind,ind is cat,dep 2 levels
			//(2)categorical --> (2+)categorical, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==2 && answers[4]==1 && answers[5]==1 )
		{ return 45; }

		//2+ vars, 2 dep, dep is cat,2 ind,ind is cat,dep 3+ levels
			//(2)categorical --> (2+)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==2 && answers[4]==1 && answers[5]==2 )
		{ return 46; }

		//2+ vars, 2 dep, dep is cat,2 ind,ind is cont,dep 2 levels
			//(2)continuous --> (2+)categorical, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==2 && answers[4]==2 && answers[5]==1 )
		{ return 47; }
	
		//2+ vars, 2 dep, dep is cat,2 ind,ind is cont,dep 3+ levels
			//(2)continuous --> (2+)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==2 && answers[4]==2 && answers[5]==2 )
		{ return 48; }

		//2+ vars, 2 dep, dep is cat,2 ind,ind is mixed,dep 2 levels
			//(2)mixed --> (2+)categorical, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==2 && answers[4]==3 && answers[5]==1 )
		{ return 49; }
	
		//2+ vars, 2 dep, dep is cat,2 ind,ind is mixed,dep 3+ levels
			//(2)mixed --> (2+)categorical, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==1 && answers[3]==2 && answers[4]==3 && answers[5]==2 )
		{ return 50; }
	
	
	//dependent variables are continuous...
	
		
		//2+ vars, 2 dep, dep is cont,1 ind,ind is cat
			//(1)categorical --> (2+)continuous
		if(answers[0]==2 && answers[1]==2 && answers[2]==2 && answers[3]==1 && answers[4]==1)
		{ return 51; }

		//2+ vars, 2 dep, dep is cont,1 ind,ind is cont
			//(1)continuous --> (2+)continuous
		if(answers[0]==2 && answers[1]==2 && answers[2]==2 && answers[3]==1 && answers[4]==2)
		{ return 52; }


		//2 independent variables...////////////////
		
		
		//2+ vars, 2 dep, dep is cont,2 ind,ind is cat
			//(2)categorical --> (2+)continuous
		if(answers[0]==2 && answers[1]==2 && answers[2]==2 && answers[3]==2 && answers[4]==1)
		{ return 53; }

		//2+ vars, 2 dep, dep is cont,2 ind,ind is cont
			//(2)continuous --> (2+)continuous
		if(answers[0]==2 && answers[1]==2 && answers[2]==2 && answers[3]==2 && answers[4]==2)
		{ return 54; }
	
		//2+ vars, 2 dep, dep is cont,2 ind,ind is mixed
			//(2)mixed --> (2+)continuous
		if(answers[0]==2 && answers[1]==2 && answers[2]==2 && answers[3]==2 && answers[4]==3)
		{ return 55; }
	
	
	//dependent variables are mixed...
	
	
		//1 independent variable...
		
		//2+ vars, 2 dep, dep is mixed,1 ind,ind is cat,dep 2 levels
			//(1)categorical --> (2+)mixed, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==1 && answers[4]==1 && answers[5]==1 )
		{ return 56; }

		//2+ vars, 2 dep, dep is mixed,1 ind,ind is cat,dep 3+ levels
			//(1)categorical --> (2+)mixed, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==1 && answers[4]==1 && answers[5]==2 )
		{ return 57; }

		//2+ vars, 2 dep, dep is mixed,1 ind,ind is cont,dep 2 levels
			//(1)continuous --> (2+)mixed, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==1 && answers[4]==2 && answers[5]==1 )
		{ return 58; }
	
		//2+ vars, 2 dep, dep is mixed,1 ind,ind is cont,dep 3+ levels
			//(1)continuous --> (2+)mixed, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==1 && answers[4]==2 && answers[5]==2 )
		{ return 59; }


		//2 independent variables... /////////////////

		
		//2+ vars, 2 dep, dep is mixed,2 ind,ind is cat,dep 2 levels
			//(2)categorical --> (2+)mixed, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==2 && answers[4]==1 && answers[5]==1 )
		{ return 60; }

		//2+ vars, 2 dep, dep is mixed,2 ind,ind is cat,dep 3+ levels
			//(2)categorical --> (2+)mixed, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==2 && answers[4]==1 && answers[5]==2 )
		{ return 61; }

		//2+ vars, 2 dep, dep is mixed,2 ind,ind is cont,dep 2 levels
			//(2)continuous --> (2+)mixed, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==2 && answers[4]==2 && answers[5]==1 )
		{ return 62; }
	
		//2+ vars, 2 dep, dep is mixed,2 ind,ind is cont,dep 3+ levels
			//(2)continuous --> (2+)mixed, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==2 && answers[4]==2 && answers[5]==2 )
		{ return 63; }

		//2+ vars, 2 dep, dep is mixed,2 ind,ind is mixed,dep 2 levels
			//(2)mixed --> (2+)mixed, 2 levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==2 && answers[4]==3 && answers[5]==1 )
		{ return 64; }
	
		//2+ vars, 2 dep, dep is mixed,2 ind,ind is mixed,dep 3+ levels
			//(2)mixed --> (2+)mixed, 3+ levels
		if(answers[0]==2 && answers[1]==2 && answers[2]==3 && answers[3]==2 && answers[4]==3 && answers[5]==2 )
		{ return 65; }
	
	}
	
	function displayFinalSlide(){
		
		$(stage).append('<div class="questionText">You have finished the quiz!<br><br>Total questions: '+numberOfQuestions+'<br>Correct answers: '+score+'</div>');
		
	}//display final slide
	
	
	
	
	
	
	
	});//doc ready