
var nPoints = [], tPoints = [];
var p1,p2, plot1, plot2;
var  startButton, pauseButton, simulation;
var start = false;
var pause = false;
var countstart;
var PI_ = 3.14;
//              gama, theta, beta,      omega,    omega nod,          thetadot
var condition = [0.2,   0,  3*PI_/4,    2*PI_,    3*PI_,               0];

function setup() { 
	c = color(100, 100, 100);
	count = 0;
  createCanvas(windowWidth, windowHeight);
	plot1 = new GPlot(this);
  plot2 = new GPlot(this);
	
	text("This is the equation that we are using for our simulation", width/2 + 200, 20);
	loadImage('https://openprocessing.org/sketch/1178711/files/motion_eqn.png', img => {
    image(img, width/2 + 50, 30,650,80);
  });
	loadImage('https://openprocessing.org/sketch/1178711/files/variables.png', img => {
    image(img, width/2 + 450, 150,200,150);
  });
	
	text("Initial condition: ω= 2pi, ω_0 = 1.5ω, beta = ω_0/4", width/2 + 400, 135);
	simulation = createSelect();
	simulation.position(width/2 + 50, 120);
	simulation.option('DDP with relatively weak drive strength gama = 0.2');
	simulation.option('DDP with drive strength gama = 1.06');
	simulation.option('DDP with drive strength gama = 1.73');
	simulation.option('DDP with drive strength gama = 1.77');
	simulation.option('DDP with drive strength gama = 1.77 with theta = -Pi/2');
	simulation.changed(selectedSimulation);
	
	text("gama", width/2 + 50, 170);
	gamaInput = createInput();
	gamaInput.position(width/2 +150, 150);
	gamaInput.value(condition[0]);
	
	text("theta", width/2 + 50, 210);
	//text("(degrees)", width/2 + 310, 210);
	thetaInput = createInput();
	thetaInput.position(width/2 +150, 190);
	thetaInput.value(condition[1]);
	
	text("beta", width/2 + 50, 250);
	betaInput = createInput();
	betaInput.position(width/2 +150, 230);
	betaInput.value(condition[2]);
	
	text("omega", width/2 + 50, 290);
	omegaInput = createInput();
	omegaInput.position(width/2 +150, 270);
	omegaInput.value(condition[3]);
	
	text("omega nod", width/2 + 50, 330);
	omeganodInput = createInput();
	omeganodInput.position(width/2 +150, 310);
	omeganodInput.value(condition[4]);
	
	text("angular velocity", width/2 + 50, 370);
	thetadotInput = createInput();
	thetadotInput.position(width/2 +150, 350);
	thetadotInput.value(condition[5]);
	
	//checkbox = select("#box1").elt;
	checkbox = createCheckbox(' Second simple pendulum?',false);
	checkbox.position(width/2 + 450, 350);
	
	startButton = createButton('start');
	startButton.position(width/2 - 50,800);
	startButton.mousePressed(makeStart);
	
	pauseButton = createButton('pause');
	pauseButton.position(width/2 + 50, 800);
	pauseButton.mousePressed(makePause);
}

function selectedSimulation(){
	condition[2] = 3*PI_/4;
	condition[3] = 2.0*PI_;
	condition[4] = 3*PI_;
	condition[5] = 0;
	
	betaInput.value(condition[2]);
	condition[3] = omegaInput.value(condition[3]);
	omeganodInput.value(condition[4]);
	thetadotInput.value(condition[5]);
	
	let val = simulation.value();
	if(val == 'DDP with relatively weak drive strength gama = 0.2'){
		condition[0] = 0.2;
		condition[1] = 0;
		gamaInput.value(condition[0]);
		thetaInput.value(condition[1]);
	}
	else if(val == 'DDP with drive strength gama = 1.06'){
		condition[0] = 1.06;
		condition[1] = 0;
		gamaInput.value(condition[0]);
		thetaInput.value(condition[1]);
		
	}
	else if(val == 'DDP with drive strength gama = 1.73'){
		condition[0] = 1.73;
		condition[1] = 0;
		gamaInput.value(condition[0]);
		thetaInput.value(condition[1]);

	}
	else if(val == 'DDP with drive strength gama = 1.77'){
		condition[0] = 1.77;
		condition[1] = 0;
		gamaInput.value(condition[0]);
		thetaInput.value(condition[1]);

	}
	else if(val == 'DDP with drive strength gama = 1.77 with theta = -Pi/2'){
		condition[0] = 1.77;
		condition[1] = -PI_/2;
		gamaInput.value(condition[0]);
		thetaInput.value(condition[1]);
	}
}

function makePause(){
	pause = !pause;
	 if (pause) {
      noLoop();
    } else {
      loop();
    }
}
function makeStart(){
	start = true;
	pause = false;
	nPoints = [];
	tPoints = [];
	condition[0] = gamaInput.value();
	condition[1] = thetaInput.value();
	condition[2] = betaInput.value();
	condition[3] = omegaInput.value();
	condition[4] = omeganodInput.value();
	condition[5] = thetadotInput.value();
	//                  gama,         theta,          beta,      omega,       omega nod,        thetadot
	p1 = new Pendulumn(condition[0], condition[1], condition[2], condition[3], condition [4], condition[5]);

	p2 = new simplePendulumn(0,   condition[1],     0    , condition[3], condition [4], condition[5]);

	loop();
}
function draw() {
	noStroke();
  fill(230);
  rect(0, 0, width/2, 400);
	fill(50);

	if(start){
		
		if(checkbox.checked()){
			p2.update();
			p2.display();
		}
		p1.update();
		p1.display();
		
		//text(p1.thetadot,10,10);
	}
}

class Pendulumn {
	//                         beta, omega, omega nod, thetadot
  constructor(gama_, theta_, beta_, omega_, omeganod_, thetadot_) {
    this.origin =  createVector(windowWidth/4, 150);
    this.location = createVector();
    this.l = float(125);
    //this.theta = -PI/2.0f ;
    this.theta = float(theta_);
    this.gama = float(gama_);
		this.beta = float(beta_);
		this.omega = float(omega_);
		this.omeganod = float(omeganod_);
    this.thetadot = float(thetadot_);
    this.thetadotdot = 0.0;
    this.t = 0;
    this.dt = 0.01;
	
  }
   update() {
    // 12.2
    this.thetadotdot = float( -2*this.beta*this.thetadot - this.omeganod*this.omeganod*sin(this.theta) + 
												this.gama*this.omeganod*this.omeganod*cos(this.omega*this.t));
    this.thetadot =float( this.thetadot + this.thetadotdot*this.dt);
    this.theta = float( this.theta+this.thetadot*this.dt);
    this.t = float(this.t + this.dt);
  }

   display() {
    //Where is the bob relative to the origin? Polar to Cartesian coordinates will tell us!
		let xx =this.l * sin(this.theta);
		let yy = this.l * cos(this.theta)
    this.location.set(xx, yy, 0);
    this.location.add(this.origin);

    stroke(0);
    //The arm
    line(this.origin.x, this.origin.y, this.location.x, this.location.y);
    
		 fill(color(30,136,219));
    //The bob
    ellipse(this.location.x, this.location.y, 16, 16);
	
    // GRAPH
    plot1.setPos(0, 400);
    plot1.setOuterDim(windowWidth/2, 400 );

    //GPoint point = new GPoint(p.t, 700 - p.theta);
    nPoints.push(new GPoint (this.t, this.theta));

    // Set the plot title and the axis labels
    plot1.setPoints(nPoints);
    plot1.getXAxis().setAxisLabelText("time");
    plot1.getYAxis().setAxisLabelText("theta");
    plot1.setTitleText("Theta vs time");
    // Draw it!
    plot1.defaultDraw();

    
    plot2.setPos(windowWidth/2, 400);
    plot2.setOuterDim(width/2, 400 );
    //GPoint point = new GPoint(p.t, 700 - p.theta);
    tPoints.push(new GPoint (this.theta, this.thetadot));
    // Set the plot title and the axis labels
    plot2.setPoints(tPoints);
    plot2.getXAxis().setAxisLabelText("theta");
    plot2.getYAxis().setAxisLabelText("thetadot");
    plot2.setTitleText("Theta vs Thetadot");

    // Draw it!
    plot2.defaultDraw();

  }
}
	class simplePendulumn {
	//                         beta, omega, omega nod, thetadot
  constructor(gama_, theta_, beta_, omega_, omeganod_, thetadot_) {
    this.origin =  createVector(windowWidth/4, 150);
    this.location = createVector();
    this.l = float(125);
    //this.theta = -PI/2.0f ;
    this.theta = float(theta_);
    this.gama = float(gama_);
		this.beta = float(beta_);
		this.omega = float(omega_);
		this.omeganod = float(omeganod_);
    this.thetadot = float(thetadot_);
    this.thetadotdot = float(0.0);
    this.t = 0;
    this.dt = 0.01;
	
  }
   update() {
    // 12.2
    this.thetadotdot = float( -2*this.beta*this.thetadot - this.omeganod*this.omeganod*sin(this.theta) + 
												this.gama*this.omeganod*this.omeganod*cos(this.omega*this.t));
    this.thetadot =float( this.thetadot + this.thetadotdot*this.dt);
    this.theta = float( this.theta+this.thetadot*this.dt);
    this.t = float(this.t + this.dt);
  }

   display() {
    //Where is the bob relative to the origin? Polar to Cartesian coordinates will tell us!
		let xx =this.l * sin(this.theta);
		let yy = this.l * cos(this.theta)
    this.location.set(xx, yy, 0);
    this.location.add(this.origin);
		 
    stroke(126);
    //The arm
    line(this.origin.x, this.origin.y, this.location.x, this.location.y);
    fill(175);
    //The bob
    ellipse(this.location.x, this.location.y, 16, 16);

  }
}

