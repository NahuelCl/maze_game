const {Engine, Render, Runner, World, Bodies} = Matter;

const cells= 9;
const width = 600;
const height = 600;
const engine = Engine.create();

const unitLength = width / cells;
//const unitWidth = width / cells;

const {world}= engine;

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width,
        height
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);



//Walls

const walls = [
    Bodies.rectangle(width/2, 0, width, 40, { isStatic: true}),
    Bodies.rectangle(width/2, height, width, 40, { isStatic: true}),
    Bodies.rectangle(0, height/2, 40, height, { isStatic: true}),
    Bodies.rectangle(width, height/2, 40, height, { isStatic: true})


];

World.add(world, walls);

//Maze generation

const shuffle = (arr) => {
    let counter = arr.length;

    while (counter > 0){
        const index = Math.floor(Math.random() * counter);
        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;

};

const grid = Array(cells)
    .fill(null)
    .map (()=>Array(cells).fill(false));

const verticals = Array(cells)
.fill(null)
.map(()=>Array(cells-1).fill(false));

const horizontals = Array(cells-1)
.fill(null)
.map(()=>Array(cells).fill(false));

console.log(grid);

const startRow = Math.floor(Math.random()* cells);
const startColumn = Math.floor(Math.random()* cells);

const stepThroughCell = (row, column) =>{
    //Si ya visite la celda en [fila,columna] entonves retorno
    if(grid[row][column]){
        return;
    }
    //Mrcar la celda como visitada
    grid[row][column] = true;
    //Armas aleatoriamente-ordenada lista de vecino
    const neighbors =shuffle( [
        [row-1, column,'up'],
        [row, column+1, 'right'],
        [row+1, column,'down'],
        [row, column-1, 'left']
    ]);
    //Por cada vecino 

    for(let neighbor of neighbors){
        const [nextRow, nextColumn, direction]  = neighbor;
       //Ver si el vecino es visitable
       if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells){
           continue; 
       }

       //Si el vecino es valido peor ya fue visitado , continuas al siguiente vecino 
       if (grid[nextRow][nextColumn]){
           continue;
       }
       //Borras Pared de horizontles y verticales
       if ( direction === 'left'){
           verticals[row][column-1] = true;
       }else if ( direction === 'right'){
        verticals[row][column] = true;
        }else if ( direction === 'up'){
            horizontals[row-1][column] = true;
        }else if ( direction === 'down'){
            horizontals[row][column] = true;
        }
        stepThroughCell(nextRow,nextColumn);
    };   

    
    // Visitar vecino

};

stepThroughCell(startRow,startColumn);

horizontals.forEach((row, rowIndex) =>{
    row.forEach((open, columnIndex) => {
        if(open){
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength/2,
            rowIndex*unitLength+unitLength,
            unitLength,
            10,
            {
                isStatic: true
            }
        );
        World.add(world,wall);
    });
});

verticals.forEach((row,rowIndex) => {
    row.forEach((open, columnIndex) =>{
        if (open){
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength,
            rowIndex * unitLength + unitLength /2,
            10,
            unitLength,
            {
                isStatic: true
            }
        );
        World.add(world,wall);
    });
});
//stepThroughCell(1,1);
