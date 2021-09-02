import { useState } from 'react'
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const tokenAddress = '0x0165878A594ca255338adfa4d48449f69242Eb8F'

function App() {
  const [greeting, setGreeting] = useState('')
  const [userAccount, setUserAccount] = useState('')
  const [amount, setAmount] = useState(0)

  const requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  const getBalance = async () => {
    if(typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account)
      console.log('Balance: ', balance.toString())
    }
  }

  const sendCoins = async () => {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer)
      const transaction = await contract.transfer(userAccount, amount)
      await transaction.wait()
      console.log(`${amount} of Coins successfully transferred to ${userAccount}`)
    }
  }

  const fetchGreeting = async () => {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('Greeting data', data )
      } catch(error) {
        console.log('Fetch greeting error', error)
      }
    }
  }

  const setGreetingValue = async () => {
    if(!greeting) return
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreeting('')
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreetingValue}>Set Greeting</button>
        <input 
        onChange={e => setGreeting(e.target.value)}
        placeholder='Set Greeting'
        value={greeting}
        />

        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input 
        onChange={e => setUserAccount(e.target.value)}
        placeholder='Account ID'
        value={userAccount}
        />
        <input 
        onChange={e => setAmount(e.target.value)}
        placeholder='Amount'
        value={amount}
        />
      </header>
    </div>
  );
}

export default App;
