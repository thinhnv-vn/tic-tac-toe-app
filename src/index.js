/**
 * Tic-tac-toe game
 * 
 * Creator Thinhnv
 * Create Date 2017/11/13
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * Square template to create a box
 * @param props propertys of box (color,size,event,value)
 * @returns button
 */
function Square(props) {
    return (
        <button className={'square ' + props.color + ' ' + props.squareSize} onClick={props.onClick}>
            {props.value}
        </button>
    );
}


/**
 * Board template to create layout of game
 */
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(props.widthOfBoard * props.heightOfBoard).fill(null), // array to store value of boxs
            squaresColor: Array(props.widthOfBoard * props.heightOfBoard).fill("square"), // array to store color of boxs
            xIsNext: true, // current player
            players: props.playerNames, // array to store name of players
            widthOfBoard: props.widthOfBoard, // width of board
            heightOfBoard: props.heightOfBoard, // height of board
            winnerScore: props.winnerScore, // win condition
            closeDialog: false, // dialog setting
            squareSize: props.widthOfBoard * props.heightOfBoard <= 25 ? 'square-big' :
                props.widthOfBoard * props.heightOfBoard > 100 ? 'square-smal' :
                    props.widthOfBoard >= 15 ? 'square-smal' : 'square-nomal' // size of boxs

        };
    }

    /**
     * Square box click event
     * @param i index of box
     */
    handleClick(i) {
        // get data from board
        const squares = this.state.squares.slice();
        const squaresColor = this.state.squaresColor.slice();
        const players = this.state.players.slice();

        // check game end or not
        if (this.state.closeDialog || calculateWinner(squares, players, this.state.widthOfBoard,
            this.state.heightOfBoard, this.state.winnerScore) || squares[i]) {
            return;
        }

        // set value for box
        squares[i] = this.state.xIsNext ? 'x' : 'o';
        squaresColor[i] = this.state.xIsNext ? 'x-color' : 'o-color';
        this.setState({
            squares: squares,
            squaresColor: squaresColor,
            players: players,
            xIsNext: !this.state.xIsNext,
        });
    }

    /**
     * Render a Square
     * @param i index of box
     * @return html button
     */
    renderSquare(i) {

        return (
            <Square
                value={this.state.squares[i]}
                color={this.state.squaresColor[i]}
                onClick={() => this.handleClick(i)}
                squareSize={this.state.squareSize}
            />
        );
    }

    /**
     * End a Game
     */
    quitGame() {

        ReactDOM.render(
            <Game />,
            document.getElementById('root')
        );
    }

    /**
     * create a  new Game
     */
    newGame() {
        this.setState({
            squares: Array(this.state.widthOfBoard * this.state.heightOfBoard).fill(null),
            xIsNext: true,
            closeDialog: false,
        });

    }

    /**
     * hide dialog message
     */
    closeDialog() {
        this.setState({
            closeDialog: true
        });

    }

    /**
     * render a board
     */
    render() {
        // find a winner
        const winner = calculateWinner(this.state.squares, this.state.players,
            this.state.widthOfBoard, this.state.heightOfBoard, this.state.winnerScore);

        // reset status of game, dialog and message
        let status = '';
        let showDialog = '';
        let msgDialog = '';

        // if have a winner then notify to players
        if (winner) {

            showDialog = !this.state.closeDialog ? 'show-dialog' : '';

            // no blank box to play then notify Draw Game
            if (winner === '0') {
                msgDialog = 'Draw!!!';
            } else {
                msgDialog = winner + ' Win!!!';
            }
            status = msgDialog;

        } else {
            // update status of game
            status = '現在のプレーヤー: ' + (this.state.xIsNext ? this.state.players[0] : this.state.players[1]);
        }

        // create an array to store index height of board
        var heightOfBoards = [];
        for (let i = 0; i < this.state.heightOfBoard; i++) {
            heightOfBoards.push(i);
        };

        // create an array to store index width of board
        var widthOfBoards = [];
        for (let j = 0; j < this.state.widthOfBoard; j++) {
            widthOfBoards.push(j);
        };

        // define size of boxs
        var i = -1;
        var containerClassName = this.state.widthOfBoard === 3 ? 'container-smal' :
            this.state.widthOfBoard === 5 ? 'container-nomal' :
                this.state.widthOfBoard === 10 ? 'container-big' :
                    this.state.widthOfBoard === 15 ? 'container-nomal' : 'container-big'

        // using two loops to render a board
        return (
            <div>
                <div className={containerClassName}>

                    <div className="status">{status} </div>
                    {
                        heightOfBoards.map((row) => {
                            return <div key={row} className="board-row">
                                {
                                    widthOfBoards.map((col) => {
                                        i++;
                                        return <div key={i}>{this.renderSquare(i)}</div>

                                    })
                                }
                            </div>
                        })
                    }
                    <div className="board-footer">
                        < button className="btn btn-danger" onClick={(event) => this.quitGame(this)}>ストップ</button>
                        <button className="btn btn-primary" onClick={(event) => this.newGame(this)}>新しいゲーム</button>
                    </div>

                </div>
                <div className={'modal-backdrop fade show ' + showDialog}></div>
                <div className={'dialog-cus ' + showDialog}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">ゲームの結果</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-primary" role="alert">
                                    {msgDialog}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" onClick={(event) => this.newGame(this)}>新しいゲーム</button>
                                <button type="button" className="btn btn-secondary" onClick={(event) => this.closeDialog(this)} data-dismiss="modal">閉</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Template to input player name
 * @param props propertys of template
 * @returns input box
 */
function Player(props) {
    return (
        <div className="form-group col-md-6 player-name">
            <label>プレイヤー{props.id + 1}名</label>
            <input type="text" className="form-control" value={props.name} placeholder={props.placeholder} onChange={props.onChange} onFocus={props.onFocus} />
        </div>
    );
}

/**
 * Index layout and setting a Game
 */
class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerNames: ['プレイヤー１', 'プレイヤー２'], // array to store name of players
            widthOfBoard: 3,  // define default width of board
            heightOfBoard: 3, // define default height of board
            winnerScore: 3 // define default win condition of game
        }

    };

    /**
     * Render board of game
     */
    playGame(e) {

        ReactDOM.render(
            <Board playerNames={this.state.playerNames}
                widthOfBoard={this.state.widthOfBoard}
                heightOfBoard={this.state.heightOfBoard}
                winnerScore={this.state.winnerScore} />,
            document.getElementById('root')
        );

    }

    /**
     * Update name of players
     */
    updatePlayer(i, e) {
        const playerNames = this.state.playerNames.slice();
        playerNames[i] = e.target.value;
        this.setState({ playerNames: playerNames });
    };

    /**
     * Clear name of players
     */
    clearText(i, e) {
        const playerNames = this.state.playerNames.slice();
        playerNames[i] = '';
        this.setState({ playerNames: playerNames });

    };

    /**
     * Store setting of layout board
     */
    updateLayoutOfBoard(e, name) {

        if (name === 'widthOfBoard') {
            this.setState({ widthOfBoard: e.target.value });
        } else if (name === 'heightOfBoard') {
            this.setState({ heightOfBoard: e.target.value });
        } else if (name === 'winnerScore') {
            this.setState({ winnerScore: e.target.value });
        }


    };

    /**
     * Render a input box
     */
    renderPlayer(i, placeholder) {
        return (
            <Player
                id={i}
                placeholder={placeholder}
                name={this.state.playerNames[i]}
                onFocus={(event) => this.clearText(i, event)}
                onChange={(event) => this.updatePlayer(i, event)}
            />
        );
    };

    /**
     * Render layout setting game
     */
    render() {
        return (

            <div className="game">
                <div className="game-info">

                    <div className="container">
                        <form>
                            <div className="form-row">
                                {this.renderPlayer(0, "渡辺")}
                                {this.renderPlayer(1, "田中")}
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="inputWidthOfBoard">ボードの幅</label>
                                    <select id="inputWidthOfBoard" className="form-control" value={this.state.widthOfBoard} onChange={(event) => this.updateLayoutOfBoard(event, 'widthOfBoard')}>
                                        <option defaultValue>3</option>
                                        <option>5</option>
                                        <option>10</option>
                                        <option>15</option>
                                        <option>20</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="inputHeightOfBoard">ボードの高</label>
                                    <select id="inputHeightOfBoard" className="form-control" value={this.state.heightOfBoard} onChange={(event) => this.updateLayoutOfBoard(event, 'heightOfBoard')}>
                                        <option defaultValue>3</option>
                                        <option>5</option>
                                        <option>10</option>
                                        <option>15</option>
                                        <option>20</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="inputWinnerScore">勝者の条件</label>
                                    <select id="inputWinnerScore" className="form-control" value={this.state.winnerScore} onChange={(event) => this.updateLayoutOfBoard(event, 'winnerScore')}>
                                        <option defaultValue>3</option>
                                        <option>4</option>
                                        <option>5</option>

                                    </select>
                                </div>
                            </div>

                            <div className="col-md-12" onClick={(event) => this.playGame(this)}><center><a href="#"><img src="../img/btn_start_off.png" alt="ゲームスタート" /></a></center></div>

                        </form></div>
                    <div />
                </div>
            </div>
        );
    }
}

/**
 * Render layout setting game
 */
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

/**
 * get name of winner
 * @param count score of player
 * @param winnerCondition conditon to win game
 * @param square value of box
 * @param players name of players
 * @return name of winner
 */
function getWinner(count, winnerCondition, square, players) {
    if (count >= winnerCondition) {
        if (square === 'x') {
            return players[0];
        }
        return players[1];
    }

}

/**
 * find a winner
 * @param squares value of boxs
 * @param players name of players
 * @param width width of board
 * @param height height of board
 * @param winnerScore conditon to win game
 * @return name of winner
 */
function calculateWinner(squares, players, width, height, winnerScore) {
    // get board info
    const widthOfBoard = parseInt(width);
    const heightOfBoard = parseInt(height);
    const winnerCondition = parseInt(winnerScore - 1);
    var isDraw = true;

    // find a winner
    for (let i = 0; i < heightOfBoard; i++) {
        for (let j = 0; j < widthOfBoard; j++) {

            // current box to check
            var currentSquare = i * widthOfBoard + j;
            if (squares[currentSquare] == null) {
                isDraw = false;
            }

            // check left to right
            var countLeft = 0;
            for (let left = 0; left < widthOfBoard - 1 - j; left++) {
                var index = currentSquare + left;
                if (squares[index] === squares[index + 1]
                    && squares[index] != null) {
                    countLeft++;
                    const result = getWinner(countLeft, winnerCondition, squares[index], players);
                    if (result) {
                        return result;
                    }
                } else {
                    break;
                }
            }

            // check up to down
            var countDown = 0;
            for (let down = 0; down < heightOfBoard - 1 - i; down++) {
                var index = currentSquare + down * widthOfBoard;
                if (squares[index] === squares[index + widthOfBoard]
                    && squares[index] != null) {
                    countDown++;
                    const result = getWinner(countDown, winnerCondition, squares[index], players);
                    if (result) {
                        return result;
                    }
                } else {
                    break;
                }
            }

            // check up to left down
            var countLeftDown = 0;
            for (let down = 0; down < heightOfBoard - 1 - i; down++) {
                var left = j + down;
                if (left > widthOfBoard - 2) {
                    break;
                }
                var index = currentSquare + down * widthOfBoard + down;
                if (squares[index] === squares[index + widthOfBoard + 1]
                    && squares[index] != null) {
                    countLeftDown++;
                    const result = getWinner(countLeftDown, winnerCondition, squares[index], players);
                    if (result) {
                        return result;
                    }
                } else {
                    break;
                }
            }

            // check up to right down
            var countRightDown = 0;
            for (let down = 0; down < heightOfBoard - 1 - i; down++) {
                var right = j - down;
                if (right < 1) {
                    break;
                }
                var index = currentSquare + down * widthOfBoard - down;
                if (squares[index] === squares[index + widthOfBoard - 1]
                    && squares[index] != null) {
                    countRightDown++;
                    const result = getWinner(countRightDown, winnerCondition, squares[index], players);
                    if (result) {
                        return result;
                    }
                } else {
                    break;
                }
            }

        }

    }

    // if no bank box then return draw game
    if (isDraw) {
        return '0';
    }

    return null;
}
