import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';
import { motion, Variants } from 'framer-motion';

type Produto = {
  nome: string;
  valor: number;
};

type ProductModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (produto: Produto) => void;
  produto: Produto | null;
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.75, y: -50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 20,
    },
  },
  exit: { opacity: 0, scale: 0.75, y: 50 },
};

const ProductModal = ({ open, onClose, onSave, produto }: ProductModalProps) => {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [erroNome, setErroNome] = useState(false);
  const [erroValor, setErroValor] = useState(false);

  useEffect(() => {
    if (produto) {
      setNome(produto.nome);
      setValor(produto.valor.toString());
    } else {
      setNome('');
      setValor('');
    }
    setErroNome(false);
    setErroValor(false);
  }, [produto]);

  const handleSaveClick = () => {
    const isNomeValid = nome.trim() !== '';
    const isValorValid = parseFloat(valor) > 0;

    setErroNome(!isNomeValid);
    setErroValor(!isValorValid);

    if (isNomeValid && isValorValid) {
      onSave({ nome, valor: parseFloat(valor) });
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
    >
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', fontWeight: 'bold' }}>
          {produto ? 'Editar Produto' : 'Adicionar Produto'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            label="Nome do Produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
            margin="normal"
            error={erroNome}
            helperText={erroNome ? 'O nome é obrigatório' : ''}
          />
          <TextField
            label="Preço"
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            fullWidth
            margin="normal"
            error={erroValor}
            helperText={erroValor ? 'O preço deve ser um valor válido' : ''}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button onClick={handleSaveClick} variant="contained" color="primary" sx={{ flexGrow: 1, mr: 1, bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}>
            {produto ? 'Salvar' : 'Adicionar'}
          </Button>
          <Button onClick={onClose} variant="outlined" color="error" sx={{ flexGrow: 1, ml: 1 }}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default ProductModal;