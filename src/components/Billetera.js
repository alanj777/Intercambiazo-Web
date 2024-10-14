// src/components/WalletScreen.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Container, Button, Alert } from 'react-bootstrap';

const WalletScreen = () => {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Asume que el usuario está autenticado y su nombre es "Casimiro Saavedra"
        const username = 'HungryDued'; 

        // Obtener datos del usuario
        const { data: userData, error: userError } = await supabase
          .from('Usuario')
          .select('*')
          .eq('Username', username)
          .single();

        if (userError) throw userError;
        setUser(userData);

        // Obtener datos de la billetera
        const { data: walletData, error: walletError } = await supabase
          .from('Billetera')
          .select('*')
          .eq('IDBilletera', userData.IDBilletera)
          .single();

        if (walletError) throw walletError;
        setWallet(walletData);

        // Obtener transacciones recientes usando 'Fecha'
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('Compra')
          .select('*')
          .eq('IDBilletera', walletData.IDBilletera)
          .order('Fecha', { ascending: false }); // Usar 'Fecha' para ordenar transacciones

        if (transactionsError) throw transactionsError;
        setTransactions(transactionsData);

      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const handleRecharge = async () => {
    const amount = prompt('Ingrese el monto para recargar:');
    if (amount) {
      try {
        const newSaldo = (wallet.Saldo || 0) + parseFloat(amount);
        await supabase
          .from('Billetera')
          .update({ Saldo: newSaldo })
          .eq('IDBilletera', wallet.IDBilletera);
          
        setSuccess('Saldo recargado exitosamente.');
        setWallet({ ...wallet, Saldo: newSaldo });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleWithdraw = async () => {
    const amount = prompt('Ingrese el monto para retirar:');
    if (amount) {
      try {
        const newSaldo = (wallet.Saldo || 0) - parseFloat(amount);
        if (newSaldo < 0) {
          setError('¡Fondos insuficientes! Parece que te has quedado sin monedas.');
          return;
        }
        
        await supabase
          .from('Billetera')
          .update({ Saldo: newSaldo })
          .eq('IDBilletera', wallet.IDBilletera);
          
        setSuccess('Saldo retirado exitosamente.');
        setWallet({ ...wallet, Saldo: newSaldo });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <Container>
      <h1>Mi Billetera</h1>
      {user && (
        <div>
          <h2>{user.Nombre} {user.Apellido}</h2>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
            <div style={{
              flex: 1,
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '20px',
              minWidth: '300px'
            }}>
              <h3>Saldo Actual</h3>
              <p>${wallet ? wallet.Saldo.toFixed(2) : 'Cargando...'}</p>
              {!wallet || wallet.Saldo <= 0 ? (
                <p>¡Oops! Parece que no tienes saldo. Anda a levantar la pala, vago</p>
              ) : null}
            </div>
            <div style={{
              flex: 2,
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '20px',
            }}>
              <h3>Transacciones Recientes</h3>
              <ul>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <li key={transaction.IDCompra}>
                      Número De Órden: {transaction.IDClase}, Precio: ${transaction.Total.toFixed(2)}, Fecha: {new Date(transaction.Fecha).toLocaleDateString()}
                    </li>
                  ))
                ) : (
                  <li>No hay transacciones recientes.</li>
                )}
              </ul>
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <Button variant="success" onClick={handleRecharge}>
                  Recargar Saldo
                </Button>
                <Button variant="danger" onClick={handleWithdraw}>
                  Retirar Saldo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
    </Container>
  );
};

export default WalletScreen;
