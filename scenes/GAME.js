// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class GAME extends Phaser.Scene {
  constructor() {
    super("main");
  }

  init() {

  }
   

  preload() {
    //.. para volver
    this.load.image("cielo", "./public/assets/Cielo.webp")
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
   
    
   this.personaje= this.physics.add.sprite(400,300, "personaje")
   this.personaje.setScale(0.1)
   this.personaje.setCollideWorldBounds(true)
   this.physics.add.collider(this.personaje, this.plataformas) 
   //this.personaje.setGravityY(10000)


   this.cursor=this.input.keyboard.createCursorKeys()
   
  


   //this.w=this.input.keyboard.addkey(phaser.input.keyboard.keycode.w); si quiero una sola

 }

  update() {
   if (this.cursor.left.isDown) {
    this.personaje.setVelocityX(-160)
   } else if (this.cursor.right.isDown) {
    this.personaje.setVelocityX(160)
  
  } else this.personaje.setVelocityX(0) 

  if (this.cursor.up.isDown){
    this.personaje.setVelocityY(-260)
  }  
  //else this.personaje.setVelocityY(0)
  
  //  }
  
}
}