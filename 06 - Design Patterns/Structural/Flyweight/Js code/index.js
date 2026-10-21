
 // =============================================================================
 // FLYWEIGHT — share common ("intrinsic") state across many objects so you can
 // support huge numbers of them with little memory. The per-object ("extrinsic")
 // state is passed in from outside instead of stored on every instance.
 //
 // Domain: a map renders a forest of trees. Each tree's mesh/texture/color is
 // shared by thousands of trees (intrinsic, stored once) while only x/y position
 // is unique per tree (extrinsic). We store the shared part ONCE in a factory.
 //
 // Build & run:
 //   node example.js
 // =============================================================================

 // ---------- Flyweight: the heavy, SHARED, intrinsic state ----------
 class TreeType {
     // Imagine this holds a big mesh + textures
     constructor(name, texture, color) {
         this.name = name;
         this.texture = texture;
         this.color = color;
     }

     render(x, y) {
         // Extrinsic x/y supplied by the caller
         console.log(
             `  draw ${this.color} ${this.name} [tex:${this.texture}] at (${x},${y})`
         );
     }
 }

 // ---------- Flyweight factory: returns shared instances, creating on demand ----------
 class TreeTypeFactory {
     constructor() {
         this.pool = new Map();
     }

     get(name, texture, color) {
         const key = `${name}|${texture}|${color}`;

         if (this.pool.has(key)) {
             return this.pool.get(key); // reuse
         }

         const treeType = new TreeType(name, texture, color);
         this.pool.set(key, treeType); // store once

         return treeType;
     }

     distinctTypes() {
         return this.pool.size;
     }
 }

 // ---------- Context: the lightweight per-object part ----------
 class Tree {
     constructor(x, y, type) {
         this.x = x;
         this.y = y;
         this.type = type; // Reference to a shared flyweight
     }

     render() {
         this.type.render(this.x, this.y);
     }
 }

 function main() {
     const factory = new TreeTypeFactory();
     const forest = [];

     // Plant 5 trees but only 2 kinds — only 2 TreeType objects exist.
     const oak = factory.get("Oak", "oak.png", "green");
     const pine = factory.get("Pine", "pine.png", "dark-green");

     forest.push(new Tree(10, 20, oak));
     forest.push(new Tree(15, 25, oak)); // Reuses the SAME TreeType
     forest.push(new Tree(30, 12, pine));
     forest.push(new Tree(33, 18, pine));

     forest.push(
         new Tree(40, 40, factory.get("Oak", "oak.png", "green"))
     ); // Reuses Oak again

     for (const tree of forest) {
         tree.render();
     }

     console.log(
         `${forest.length} trees rendered using only ${factory.distinctTypes()} shared TreeType objects.`
     );
 }

 main();
