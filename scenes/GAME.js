// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class GAME extends Phaser.Scene {
  constructor() {
    super("GAME");
  }

  init() {
    //timer y game over
    this.gameOver = false;
    this.timer = 30;
    this.score = 0;
    this.shapes = {
      triangulo: {points: 10, count: 0 },
      cuadrado: {points: 20, count: 0 },
      diamante: {points: 30, count: 0 },
    }
     // Agregar una propiedad para contar los rebotes
   // this.recolectables.reboundCount = 0;
    //this.maxRebounds = 5; // Número máximo de rebotes antes de destruir la bola
  }
   

  preload() {
    //.. para volver
    this.load.image("cielo", "./public/assets/Cielo.webp")
    this.load.image("cuadrado", "./public/assets/square.png")
    this.load.image("diamante", "./public/assets/diamond.png")
    this.load.image("triangulo", "./public/assets/triangle.png")
    this.load.image("plataforma", "./public/assets/platform.png")
    this.load.image("personaje", "./public/assets/Ninja.png")
  }

  create() {
   this.cielo = this.add.image(400,300, "cielo")
   this.cielo.setScale(2)
   
   this.plataformas=this.physics.add.staticGroup()
   //this.plataforma= this.add.image(400,568, "plataforma")
   //this.plataforma.setScale(2)

   this.plataformas.create(400,568, "plataforma").setScale(2).refreshBody();
   this.plataformas.create(200, 400, "plataforma");
   
    //personaje
   this.personaje= this.physics.add.sprite(400,300, "personaje")
   this.personaje.setScale(0.1)
   this.personaje.setCollideWorldBounds(true)

   //colision personaje-plataforma
   this.physics.add.collider(this.personaje, this.plataformas) 
   //this.personaje.setGravityY(10000)

//teclas
   this.cursor=this.input.keyboard.createCursorKeys()
  
   //this.w=this.input.keyboard.addkey(phaser.input.keyboard.keycode.w); si quiero una sola

   
   //agregar r
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
   //evento 1 seg
    this.time.addEvent({
      delay: 1000,
      callback: this.HandlerTimer,
      callbackScope: this,
      loop: true,
    });

    //se agrega timer en la esquina superior 
    this.timerText = this.add.text(10,10, `tiempo restante: ${this.timer}`,{
      fontSize: "32px",
      fill: "#fff"
    })
 
    //crear recolectables
    this.recolectables = this.physics.add.group();
    //this.physics.add.collider(this.recolectables, this.plataformas);
    this.physics.add.collider(this.personaje,this.recolectables, this.pj, null,this);
    this.physics.add.collider(this.recolectables,this.plataformas, this.onRecolectableBounced, null, this )

    //this.recolectables.setBounce(1)
    //if (this.recolectables.isTouching.down){
    //  this.plataformas.setVelocityY(-330)
    //  score=socer-1
    //}

    
    // agregar el score arriba

    this.scoreText = this.add.text(10, 50, `puntaje: ${this.score} / T: ${this.shapes["triangulo"].count} / C: ${this.shapes["cuadrado"].count} / D: ${this.shapes["diamante"].count}`)

      //velocidad de caida de objetos
    this.time.addEvent({
      delay: 700,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });


   const cumplePuntos = this.score >= 100;
    const cumpleFiguras =
      this.shapes["triangulo"].count >= 2 &&
      this.shapes["cuadrado"].count >= 2 &&
      this.shapes["diamante"].count >= 2;

    if (cumplePuntos % cumpleFiguras) {
      console.log("Ganaste");
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver
      })}

    
  }
  

  // recoleccion de objeto
  
  pj( _personaje,recolectables) {
    const nombreFig = recolectables.getData("tipo");
    const puntosFig = recolectables.getData("points");

    this.score += puntosFig;

    this.shapes [nombreFig].count += 1;
    
   // const points= recolectables.getData("points")
    
    console.table(this.shapes);
    console.log("score", this.score);
    recolectables.destroy();

    this.scoreText.setText(
      `puntaje: ${this.score} 
       T: ${this.shapes["triangulo"].count} 
       C: ${this.shapes["cuadrado"].count}  
       D: ${this.shapes["diamante"].count}`
    )
     
    this.checkWin();
  }


  checkWin(){
    const cumplePuntos = this.score >= 100;
    const cumpleFiguras = 
    this.shapes["triangulo"].count >= 2 &&
    this.shapes["cuadrado"].count >= 2 &&
    this.shapes["diamante"].count >= 2;

    if (cumplePuntos && cumpleFiguras) {
      console.log("Ganaste");
      this.scene.start("end",{
        score: this.score,
        gameOver: this.gameOver,
      })
     }
  }
  
    
  //timer
  HandlerTimer(){
    this.timer-=1;
    this.timerText.setText(`tiempo restante: ${this.timer}`);
    if (this.timer===0){
      this.gameOver=true
      this.gameOver = true;
      this.scene.start("end",{
        score: this.score,
        gameOver: this.gameOver,
      })
    } 
   
  }

  //timer de objetos
  onSecond() {
    if (this.gameOver){
      return;
    }
    const tipos = ["triangulo", "cuadrado", "diamante"];

    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectables = this.recolectables.create(
      Phaser.Math.Between(10, 790),
      0,
      tipo
    );
    recolectables.setVelocity(0,100);
  
    //rebote
    const rebote= Phaser.Math.FloatBetween(0.4, 0.8);
    recolectables.setBounce(rebote);

    //set data
    recolectables.setData("points",this.shapes[tipo].points);
    recolectables.setData("tipo",tipo);
    }
   onRecolectableBounced(recolectables, _plataformas){
    let points = recolectables.getData("points");
    points -= 5;
    recolectables.setData("points", points);
    if (points <= 0) {
      recolectables.destroy();
    }
    console.log(this.onRecolectableBounced)
   }
   

  update() {
    if (this.cursor.left.isDown) {
      this.personaje.setVelocityX(-160)
    } else if (this.cursor.right.isDown) {
      this.personaje.setVelocityX(160)
    } else this.personaje.setVelocityX(0) 

    if (this.cursor.up.isDown && this.personaje.body.touching.down){
      this.personaje.setVelocityY(-330); 
    }
    if( this.r.isDown){
      console.log("reincia")
      this.scene.restart(`GAME`);
      
    }
    if(this.gameOver){
        this.physics.pause();
        this.timerText.setText("Game Over");
        return;
    }
    
  }  
  
}