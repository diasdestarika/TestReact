import React, { Component } from 'react';
import PropTypes from 'prop-types';
/*Pemakaian
<Timer
    minutes: integer max 59 *required
                 use state to enable reset
    seconds : integer max 59 *required
                use state to enable reset
    reset : boolean =
    timeUpMessage: string
    timerOff : function ( jika mau trigger function setelah timer selesai)
/>

minutes : minutes in countdiown timer
seconds : seconds in countdown timer
reset : set to false ,   
    if need to reset: 1. set this property with state   2.  state reset= true then reset= false
timeUpMessage : message to show when timer off
timerOff : take function as parameter , this function will be called when timer off

*/
export default class Timer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            minutes: this.props.minutes !== undefined ? this.props.minutes : 1,
            seconds: this.props.seconds !== undefined ? this.props.seconds : 0
        };
    }

    componentDidUpdate() {
        // console.log("HM ",this.props.resetTimer);
        
        if (this.props.resetTimer === true) {
            // console.log("KESELLL");
            this.setMinSec(this.props.minutes, this.props.seconds);
            this.myInterval = setInterval(() => {
                const { seconds, minutes } = this.state

                if (seconds > 0) {
                    this.setState(({ seconds }) => ({
                        seconds: seconds - 1
                    }))
                }
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(this.myInterval)
                        if (this.props.timerOff !== undefined) {
                            // console.log("DID UPDATE1ST");
                            
                            this.props.timerOff();
                        }
                    } else {
                        this.setState(({ minutes }) => ({
                            minutes: minutes - 1,
                            seconds: 59
                        }))
                    }
                }
            }, 1000);

        } else {
            // console.log("HAHAHAHAHA");
        }

    }

    componentWillUnmount() {
        // console.log("CRAZY");
        clearInterval(this.myInterval)
    }

    setMinSec(minutes, seconds) {
        this.setState({
            minutes: minutes,
            seconds: seconds
        });
    }


    render() {
        const { minutes, seconds } = this.state;
        return (
            <div className="text-center pt-1">
                {minutes === 0 && seconds === 0
                    ? <h1>{this.props.timeUpMessage}</h1>
                    : <span>
                        <h1 style={{ fontSize: "15px" }}>Masa berkalu kode yang dikirimkan</h1>
                        <h1 style={{ fontSize: "20px" }}>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                        <h1 style={{ fontSize: "15px" }}> <b>Silakan memasukan 6-digit kode:</b></h1>
                    </span>
                }
            </div>
        )
    }

}


Timer.propTypes = {
    minutes: PropTypes.number.isRequired,
    seconds: PropTypes.number.isRequired,
    resetTimer: PropTypes.bool.isRequired,
    timeUpMessage: PropTypes.string.isRequired,
    timerOff: PropTypes.func
};