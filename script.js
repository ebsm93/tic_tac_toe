(function () {  //Name input sequence

	const nameForm = document.querySelector('#nameForm');
	const submitNameBtn = document.querySelector("#submitNameBtn");
	const scoreBoard = document.querySelector('#scoreBoard');
	const name = document.querySelector('#nameInput');
	name.value = '';
	submitNameBtn.addEventListener('click', submitName);



	function submitName() {
		scoreBoard.textContent = `${name.value} vs CPU`;
		submitNameBtn.removeEventListener('click', submitName);
		nameForm.innerHTML = '';
		nameForm.style.padding = '0px';
		GameBoard(name.value);
		// console.log(game);
	};

	// No returns. only direct DOM manipulation
})();


const GameBoard = (name) => {
	
	const board = document.querySelector('#gameBoard');
	cell_array = [];

	//Cell factory function
	const CellObject = (cellname) => {
		occupied = false;
		currentMark = '';
		return {
			cellname,
			occupied,
			currentMark
		}	
	}
	
	let cellCount = 0
	for (let i = 1;i<=3;i++) {

		let row = document.createElement('div');
		row.classList.add('row');
		row.setAttribute('id',`row${i}`);

		for (let n = 1;n<=3;n++) {
			cellCount += 1;

			//Creation of cell objects
			let cell = CellObject(`cell${cellCount}`);
			cell_array.push(cell);

			//Creation of DOM div elements for cells
			let cellDOM = document.createElement('div');
			cellDOM.classList.add('cell');
			cellDOM.setAttribute('id', `cell${cellCount}`);
			row.appendChild(cellDOM);
		board.appendChild(row);
		}
	}
	//launch game
	gameEngine(cell_array, name);
};

function gameEngine (cells, name) {

	let gameActive = true;
	
	let winCombos = genWinComs(cells);
	cpuMoveOptions = [...cells];


	//set event listeners for each cell
	const cellDOMarray = document.querySelectorAll('.cell');
	cellDOMarray.forEach(c => {
	c.addEventListener('click',clickSpace);
	}); 

	let currentTurn = `${name}`;
	const currentTurnDOM = document.querySelector('#currentTurn');
	shiftTurn();


	function shiftTurn() {
		//toggle turn display
		if (currentTurn === `${name}`) {
			currentTurnDOM.textContent = `current turn: ${name}`;
		} else {
			currentTurnDOM.textContent = `current turn: CPU`;
			setTimeout(cpuTurn, 1500);
		}
	}

	function clickSpace() {
		//get info from clicked cell, find and send corresponding object to process cell function
		cellDOMid = this.getAttribute('id');
		cellIndex = cells.findIndex((cell) => cell.cellname === cellDOMid);
		cpuCellIndex = cpuMoveOptions.findIndex((cpuCell) => cpuCell.cellname === cellDOMid);
		cell = cells[cellIndex];
		processCell(cell, cellDOMid, cpuCellIndex);
	}

	function processCell(cell, cellDOMid, cpuCellIndex) {
		if (cell.occupied) {
			alert('This cell has already been used');
		} else {
			cellDOM = document.getElementById(cellDOMid);
			cellDOM.innerHTML = '<img src="./images/transparentO.png" alt="O mark" style="height: 100px; width: auto;">'; //insert transparent O image into cell
			cell.occupied = true;
			cell.currentMark = 'O';
			cpuMoveOptions.splice(cpuCellIndex, 1);	//remove this cell object from possible CPU move options
			currentTurn = `CPU`;
			analyzeBoard()
			shiftTurn();
		}
	}

	function cpuTurn() {

		let amountOptions = cpuMoveOptions.length - 1;
		let cpuChoice;

		if (amountOptions === 1) {
			cpuChoice = cpuMoveOptions[0];
			cpuMoveOptions.splice(0, 1);
		} else if (amountOptions <= 0 ) {
			analyzeBoard()
			if (gameActive) {
			alert('TIE');
			}
			gameOver();
		} else {
			let cpuRandomChoiceIndex = Math.floor(Math.random() * amountOptions);
			console.log(`CPU RAND INDEX: ${cpuRandomChoiceIndex}`);
			cpuChoice = cpuMoveOptions[cpuRandomChoiceIndex];
			console.log(`CPU RAND CHOICE: ${cpuChoice}`);
			cpuMoveOptions.splice(cpuRandomChoiceIndex, 1);
		}
		cpuChoice.occupied = true;
		cpuChoice.currentMark = 'X'
		
		console.log(cpuMoveOptions);

		cellDOM = document.getElementById(cpuChoice.cellname);
		cellDOM.innerHTML = '<img src="./images/transparentX.png" alt="X mark" style="height: 100px; width: auto;">';

		currentTurn = `${name}`;
		analyzeBoard()
		shiftTurn();
	}

	function analyzeBoard() {

		winCombos.forEach(combo => {
			markers = [];
			combo.forEach(cell => {markers.push(cell.currentMark)});
			markers = markers.join('');
			console.log(typeof(markers))
			console.log(markers)
			if (markers === 'OOO') {
				setTimeout(function() {alert(`${name} WINS!`)}, 500);
				setTimeout(gameOver, 1000);
				// gameOver()
			} else if (markers === 'XXX') {
				setTimeout(function() {alert(`CPU WINS!`)}, 500);
				setTimeout(gameOver, 1000);
			}
		}); 
	}

	function genWinComs(cells) {
	
		let winCombos =
		[[cells[0],cells[1], cells[2]],
		[cells[3],cells[4], cells[5]],
		[cells[6],cells[7], cells[8]],
		[cells[0],cells[3], cells[6]],
		[cells[1],cells[4], cells[7]],
		[cells[2],cells[5], cells[8]],
		[cells[0],cells[4], cells[8]],
		[cells[2],cells[4], cells[6]]]

		return winCombos;
	}

	function gameOver() {
		console.log('game over');
		location.reload()
		gameActive = false;
	}
}
