var Ms = React.createClass({
  getInitialState: function () {
    return {
      board: new window.Minesweeper.Board(9, 10),
      update: ""
    };
  },
  restartGame: function () {
    this.setState( {board: new window.Minesweeper.Board(9, 10)});
  },
  updateGame: function (tile, flagging) {

    if (flagging) {
      tile.toggleFlag();
    }
    else {
      tile.explore();
    }
    this.setState({update: ""});
  },
  render: function () {
    return <Board board={this.state.board} updateGame={this.updateGame} restartGame={this.restartGame}/>;
  }
});

var Board = React.createClass({
  render: function () {
    var modalForm = <Modal board={this.props.board} restartGame={this.props.restartGame} />;
    var tileArray = this.props.board.grid.map(function(row, y) {
      return <div>
              {row.map(function (tile, x) {
               return <Tile tile={this.props.board.grid[y][x]} updateGame={this.props.updateGame} key={"row-"+ y + "-col-" + x} />;
             }.bind(this))}
            </div>;
    }.bind(this));
  return <div>
          {tileArray}
          {modalForm}
         </div>;
  }
});

var Tile = React.createClass({
  handleClick: function (event) {
    this.props.updateGame(this.props.tile, event.altKey);
  },
  render: function () {
    var displayVal = " ";
    var displayClass = "unexplored";
    if (this.props.tile.explored) {
      if (this.props.tile.bombed) {
        displayVal = "💣";
        displayClass = "bomb";
      } else if (this.props.tile.adjacentBombCount() > 0) {
        displayVal = this.props.tile.adjacentBombCount();
        displayClass = "number";
      } else {
        displayVal = " ";
        displayClass = "explored";
      }
    }
    else {
      if (this.props.tile.flagged) {
        displayVal = "🚩";
        displayClass = "flag";
      }
    }
    return <div onClick={this.handleClick} className={ "tile " + displayClass} >
              {displayVal}
          </div>;
  }
});


var Modal = React.createClass({
    closeGame: function () {
      this.props.restartGame();
    },
    render: function () {
      var modalState = "modal";
      if (this.props.board.lost() || this.props.board.won()) {
        if (this.props.board.won()) {
          modalState = "modal is-active winner";
        }
        else {
          modalState = "modal is-active loser";
        }
      }
      return <div className={modalState}>
                <article className="modal-content">
                  <span onClick={this.closeGame} className="modal-close js-hide-modal">&times;</span>
                  <h2></h2>
                  <p>Close to play again!</p>
                </article>
                  <div className="modal-screen js-hide-modal"></div>
              </div>;
    }
  });
