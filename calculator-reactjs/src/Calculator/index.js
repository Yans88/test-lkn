import React, {Component, Fragment} from 'react';
import angkaTerbilang from '@develoka/angka-terbilang-js';
import CalculatorDisplay from "./CalculatorDisplay";
import CalculatorKey from "./CalculatorKey";
import '../index.css'
import CalculatorService from "./CalculatorService";

const CalculatorOperations = {
    '/': (prevValue, nextValue) => prevValue / nextValue,
    '*': (prevValue, nextValue) => prevValue * nextValue,
    '+': (prevValue, nextValue) => prevValue + nextValue,
    '-': (prevValue, nextValue) => prevValue - nextValue,
    '=': (prevValue, nextValue) => nextValue
}
const tokenLogin = process.env.REACT_APP_TOKEN_LOGIN;

class Calculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            displayValue: '0',
            operator: null,
            terbilang: '',
            waitingForOperand: false,
            isLogin: false,
            username: '',
        };
    }

    clearAll() {
        this.setState({
            value: null,
            displayValue: '0',
            operator: null,
            terbilang: '',
            username: '',
            waitingForOperand: false
        })
    }

    clearDisplay() {
        this.setState({
            displayValue: '0',
            terbilang: ''
        })
    }

    clearLastChar() {
        const {displayValue} = this.state

        this.setState({
            displayValue: displayValue.substring(0, displayValue.length - 1) || '0'
        })
    }

    toggleSign() {
        const {displayValue} = this.state
        const newValue = parseFloat(displayValue) * -1

        this.setState({
            displayValue: String(newValue)
        })
    }

    inputPercent() {
        const {displayValue} = this.state
        const currentValue = parseFloat(displayValue)

        if (currentValue === 0)
            return

        const fixedDigits = displayValue.replace(/^-?\d*\.?/, '')
        const newValue = parseFloat(displayValue) / 100

        this.setState({
            displayValue: String(newValue.toFixed(fixedDigits.length + 2))
        })
    }

    inputDot() {
        const {displayValue} = this.state

        if (!(/\./).test(displayValue)) {
            this.setState({
                displayValue: displayValue + '.',
                waitingForOperand: false
            })
        }
    }

    inputDigit(digit) {
        const {displayValue, waitingForOperand} = this.state

        if (waitingForOperand) {
            this.setState({
                displayValue: String(digit),
                waitingForOperand: false
            })
        } else {
            this.setState({
                displayValue: displayValue === '0' ? String(digit) : displayValue + digit
            })
        }
    }

    performOperation(nextOperator) {
        const {value, displayValue, operator} = this.state
        const inputValue = parseFloat(displayValue)

        if (value == null) {
            this.setState({
                value: inputValue
            })
        } else if (operator) {
            const currentValue = value || 0
            const newValue = CalculatorOperations[operator](currentValue, inputValue)

            this.setState({
                value: newValue,
                displayValue: String(newValue)
            })
        }

        this.setState({
            waitingForOperand: true,
            operator: nextOperator
        })
    }

    handleKeyDown = (event) => {
        let {key} = event

        if (key === 'Enter')
            key = '='

        if ((/\d/).test(key)) {
            event.preventDefault()
            this.inputDigit(parseInt(key, 10))
        } else if (key in CalculatorOperations) {
            event.preventDefault()
            this.performOperation(key)
        } else if (key === '.') {
            event.preventDefault()
            this.inputDot()
        } else if (key === '%') {
            event.preventDefault()
            this.inputPercent()
        } else if (key === 'Backspace') {
            event.preventDefault()
            this.clearLastChar()
        } else if (key === 'Clear') {
            event.preventDefault()

            if (this.state.displayValue !== '0') {
                this.clearDisplay()
            } else {
                this.clearAll()
            }
        }
    };

    componentDidMount() {
        const token = localStorage.getItem(tokenLogin);
        if (token) this.profile();
        document.addEventListener('keydown', this.handleKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown)
    }

    showTerbilang() {
        const {displayValue} = this.state;
        let val = displayValue;
        if (Number(displayValue) < 0) {
            val = displayValue.replace('-', '');
        }

        this.setState({
            terbilang: String(val)
        });
    }

    login = async () => {
        const param = {username: this.state.username}
        await CalculatorService.postData(param, 'LOGIN')
            .then(response => {
                const data = response.data.data;
                if (response.data.status === 201) {
                    localStorage.setItem(tokenLogin, data?.access_token);
                    this.setState({
                        isLogin: true
                    })
                }

            })
            .catch(e => {
                console.log(e);
            });
    };

    logout = async () => {
        await CalculatorService.postData('', 'LOGOUT')
            .then(response => {
                localStorage.removeItem(tokenLogin);
                this.setState({
                    isLogin: false
                })
            })
            .catch(e => {
                console.log(e);
            });
    };

    profile = async () => {
        await CalculatorService.postData('', 'PROFILE')
            .then(response => {
                if (response.data.status === 200) {
                    this.setState({
                        isLogin: true
                    })
                } else {
                    localStorage.removeItem(tokenLogin);
                    this.setState({
                        isLogin: false
                    })
                }
            })
            .catch(e => {
                console.log(e);
            });
    };


    render() {
        const {displayValue, terbilang, isLogin, username} = this.state

        const clearDisplay = displayValue !== '0'
        const clearText = clearDisplay ? 'C' : 'AC';
        const dataTerbilang = Number(displayValue) < 0 && terbilang ? 'Min ' + angkaTerbilang(terbilang) : angkaTerbilang(terbilang);
        return (

            <Fragment>
                {isLogin ?
                    <>
                        <button className="btnLogout" onClick={this.logout.bind(this)}>Logout</button>
                        <div className="calculator">

                            <CalculatorDisplay value={displayValue}/>
                            <div className="calculator-keypad">
                                <div className="input-keys">
                                    <div className="function-keys">

                                        <CalculatorKey className="key-clear"
                                                       onPress={() => clearDisplay ? this.clearDisplay() : this.clearAll()}>{clearText}</CalculatorKey>
                                        <CalculatorKey className="key-sign"
                                                       onPress={() => this.toggleSign()}>±</CalculatorKey>
                                        <CalculatorKey className="key-percent"
                                                       onPress={() => this.inputPercent()}>%</CalculatorKey>
                                    </div>
                                    <div className="digit-keys">
                                        <CalculatorKey className="key-0"
                                                       onPress={() => this.inputDigit(0)}>0</CalculatorKey>
                                        <CalculatorKey className="key-dot"
                                                       onPress={() => this.inputDot()}>●</CalculatorKey>
                                        <CalculatorKey className="key-1"
                                                       onPress={() => this.inputDigit(1)}>1</CalculatorKey>
                                        <CalculatorKey className="key-2"
                                                       onPress={() => this.inputDigit(2)}>2</CalculatorKey>
                                        <CalculatorKey className="key-3"
                                                       onPress={() => this.inputDigit(3)}>3</CalculatorKey>
                                        <CalculatorKey className="key-4"
                                                       onPress={() => this.inputDigit(4)}>4</CalculatorKey>
                                        <CalculatorKey className="key-5"
                                                       onPress={() => this.inputDigit(5)}>5</CalculatorKey>
                                        <CalculatorKey className="key-6"
                                                       onPress={() => this.inputDigit(6)}>6</CalculatorKey>
                                        <CalculatorKey className="key-7"
                                                       onPress={() => this.inputDigit(7)}>7</CalculatorKey>
                                        <CalculatorKey className="key-8"
                                                       onPress={() => this.inputDigit(8)}>8</CalculatorKey>
                                        <CalculatorKey className="key-9"
                                                       onPress={() => this.inputDigit(9)}>9</CalculatorKey>
                                    </div>
                                </div>
                                <div className="operator-keys">
                                    <CalculatorKey className="key-divide"
                                                   onPress={() => this.performOperation('/')}>÷</CalculatorKey>
                                    <CalculatorKey className="key-multiply"
                                                   onPress={() => this.performOperation('*')}>×</CalculatorKey>
                                    <CalculatorKey className="key-subtract"
                                                   onPress={() => this.performOperation('-')}>−</CalculatorKey>
                                    <CalculatorKey className="key-add"
                                                   onPress={() => this.performOperation('+')}>+</CalculatorKey>
                                    <CalculatorKey className="key-equals"
                                                   onPress={() => this.performOperation('=')}>=</CalculatorKey>
                                </div>
                            </div>

                        </div>

                        <button className="btnTerbilang" onClick={this.showTerbilang.bind(this)}>Show Terbilang</button>
                        <span className="terbilang">terbilang : {dataTerbilang}</span>
                    </>
                    :
                    <>
                        <div className="kotak_login">
                            <p className="tulisan_login">Silahkan login</p>

                            <form>
                                <label>Username</label>
                                <input type="text" name="username" className="form_login"
                                       placeholder="Username . . . ." value={username && username}
                                       onChange={(e) => this.setState({username: e.target.value})}/>

                                <button type="button" className="tombol_login" onClick={this.login.bind(this)}
                                        disabled={username && username.length >= 3 ? false : true}>Login
                                </button>
                            </form>

                        </div>
                    </>
                }
            </Fragment>

        );
    }
}

export default Calculator;