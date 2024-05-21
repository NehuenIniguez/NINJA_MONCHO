// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class GAME extends Phaser.Scene {
  constructor() {
    super("main");
  }

  init() {
    //timer y game over
    this.gameOver = false;
    this.timer = 6;
    this.score = 0;
    this.shapes = {
      "triangulo": { points: 10, count: 0 },
      "cuadrado": { points: 20, count: 0 },
      "diamante": {points: 30, count: 0 }
    }
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
    this.physics.add.collider(this.personaje, this.recolectables)
    this.physics.add.collider(this.personaje,this.recolectables, this.pj, null,this )
    this.physics.add.overlap(this.recolectables,this.plataformas, this.floor, null, this )
      
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
    
    
  }
  

  // recoleccion de objeto
  
  pj( _personaje,recolectable) {
    recolectable.destroy();
  }
    
  //destruccion de objeto

  floor(recolectable,_plataformas){
    recolectable.destroy(true,true)
    //recolectables.destroy()
  }
    
  //timer
  HandlerTimer(){
    this.timer-=1;
    this.timerText.setText(`tiempo restante: ${this.timer}`);
    if (this.timer===0){
      this.gameOver=true
    }
  }

  //timer de objetos
  onSecond() {
    if (this.gameOver){
      return;
    }
    const tipos = ["triangulo", "cuadrado", "diamante"];
    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(
      Phaser.Math.Between(15, 785),
      0,
      tipo
      
    ).setScale(1).refreshBody();
    
   recolectable.setVelocity(0,100)
   this.physics.add.collider(recolectable, this.recolectables)
    }
  

  update() {
    if(this.gameOver && this.r.isDown){
      console.log("reincia")
      this.scene.restart();
      }
      if(this.gameOver){
        this.physics.pause();
        this.timerText.setText("Game Over");
        return;
      }
      if (this.cursor.left.isDown) {
      this.personaje.setVelocityX(-160)
      } else if (this.cursor.right.isDown) {
      this.personaje.setVelocityX(160)
    } else this.personaje.setVelocityX(0) 

    if (this.cursor.up.isDown && this.personaje.body.touching.down){
      this.personaje.setVelocityY(-330); 
    }
  }  
  
}