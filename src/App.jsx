import React from "react";
import "./App.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.audioRef = React.createRef();
    this.state = {
      currentTime: "Session",
      breakLength: 5,
      sessionLength: 25,
      countdown: 1500,
      loop: undefined,
      isPlaying: false,
    };
  }

  // convert countdown to minutes and seconds.

  convertToTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return `${minutes}:${seconds}`;
  };

  // play and pause buttons.

  handlePlayPause = () => {
    const { isPlaying } = this.state;
    if (isPlaying) {
      this.setState({
        isPlaying: false,
      });
      clearInterval(this.loop);
    } else {
      this.setState({
        isPlaying: true,
      });
      this.loop = setInterval(() => {
        const { countdown, currentTime, sessionLength, breakLength } =
          this.state;
        if (countdown === 0) {
          this.audioRef.current.play();
          if (currentTime === "Session") {
            this.setState({
              countdown: breakLength * 60,
              currentTime: "Break",
            });
          } else {
            this.setState({
              countdown: sessionLength * 60,
              currentTime: "Session",
            });
          }
        } else {
          this.setState({
            countdown: countdown - 1,
          });
        }
      }, 1000);
    }
  };

  // handle break length

  breakDecrease = () => {
    const { breakLength } = this.state;
    if (breakLength !== 1) {
      this.setState({
        breakLength: breakLength - 1,
      });
    }
  };

  breakIncrease = () => {
    const { breakLength } = this.state;
    if (breakLength !== 60) {
      this.setState({
        breakLength: breakLength + 1,
      });
    }
  };

  // handle session length

  sessionIncrease = () => {
    const { sessionLength } = this.state;
    if (sessionLength !== 60) {
      this.setState({
        sessionLength: sessionLength + 1,
        countdown: (sessionLength + 1) * 60,
      });
    }
  };

  sessionDecrease = () => {
    const { sessionLength } = this.state;
    if (sessionLength !== 1) {
      this.setState({
        sessionLength: sessionLength - 1,
        countdown: (sessionLength - 1) * 60,
      });
    }
  };

  // reset button.

  handleReset = () => {
    this.setState({
      countdown: 1500,
      isPlaying: false,
      sessionLength: 25,
      breakLength: 5,
      currentTime: "Session",
    });
    clearInterval(this.loop);
    this.audioRef.current.pause();
    this.audioRef.current.currentTime = 0;
  };

  render() {
    const { countdown, isPlaying, breakLength, sessionLength, currentTime } =
      this.state;

    const breakProps = {
      name: "Break",
      length: breakLength,
      handleDecrease: this.breakDecrease,
      handleIncrease: this.breakIncrease,
    };

    const sessionProps = {
      name: "Session",
      length: sessionLength,
      handleDecrease: this.sessionDecrease,
      handleIncrease: this.sessionIncrease,
    };

    const Timer = (props) => {
      let id = props.name.toLowerCase();
      return (
        <div className="timer">
          <h2 id={`${id}-label`}>{props.name} Length</h2>
          <div className="wrapper">
            <button id={`${id}-decrement`} onClick={props.handleDecrease}>
              <i className="fas fa-square-minus" />
            </button>
            <span id={`${id}-length`}>{props.length}</span>
            <button id={`${id}-increment`} onClick={props.handleIncrease}>
              <i className="fas fa-plus-square" />
            </button>
          </div>
        </div>
      );
    };

    return (
      <div>
        <div className="flex">
          <Timer {...breakProps} />
          <Timer {...sessionProps} />
        </div>
        <div>
          <div className="clock-container">
            <h2 id="timer-label">{currentTime}</h2>
            <div id="time-left" className="countdown">
              {this.convertToTime(countdown)}
            </div>
            <audio
              src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
              id="beep"
              ref={this.audioRef}
            ></audio>
            <button id="start_stop" onClick={this.handlePlayPause}>
              <i className={`fas fa-${isPlaying ? "pause" : "play"}`} />
            </button>
            <button id="reset" className="reset" onClick={this.handleReset}>
              <i className="fas fa-sync" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// ReactDOM.render(<App />, document.getElementById("app"));
export default App;
