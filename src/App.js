import { useState } from 'react'
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

function App() {
  const [greeting, setGreeting] = useState('')

  const requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
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
      </header>
    </div>
  );
}

export default App;
