import { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  Typography,
  IconButton,
  Button, // Importando Button
} from '@mui/material';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Componente para o Modal (em um arquivo separado: ProductModal.tsx)
import ProductModal from './ProductModal';

type Produto = {
  nome: string;
  valor: number;
};

const initialRows: Produto[] = [
  { nome: 'Calça Masculina 44', valor: 159 },
  { nome: 'Calça Masculina 42', valor: 159 },
  { nome: 'Calça Masculina 40', valor: 159 },
  { nome: 'Calça Masculina 39', valor: 159 },
  { nome: 'Calça Masculina 38', valor: 159 },
  { nome: 'Calça Masculina 37', valor: 159 },
  { nome: 'Calça Masculina 36', valor: 159 },
];

const MotionTableRow = motion(TableRow);
const MotionIconButton = motion(IconButton);

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.3
    }
  }
};

const iconButtonVariants: Variants = {
  rest: { scale: 1, opacity: 0.8 },
  hover: { scale: 1.2, opacity: 1, transition: { duration: 0.2 } },
  tap: { scale: 0.9 },
};

function App2() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [rows, setRows] = useState<Produto[]>(initialRows);
  const [openModal, setOpenModal] = useState(false);
  const [produtoEdicao, setProdutoEdicao] = useState<Produto | null>(null);

  const handleOpenModal = (produto: Produto | null) => {
    setProdutoEdicao(produto);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setProdutoEdicao(null);
  };

  const handleSave = (produto: Produto) => {
    if (produtoEdicao) {
      setRows(rows.map(p => (p.nome === produtoEdicao.nome ? produto : p)));
    } else {
      setRows([...rows, produto]);
    }
    handleCloseModal();
  };

  const handleDelete = (nome: string) => {
    setRows(rows.filter(row => row.nome !== nome));
  };

  return (
    <div className='p-4 md:px-20 md:py-10 bg-gray-50 min-h-screen'>
      <Box className="flex flex-col items-center">
        <Typography variant="h4" component="h1" gutterBottom className='text-center text-gray-800 font-bold mb-6'>
          Gerenciamento de Produtos
        </Typography>

        <Paper elevation={3} className='w-full max-w-4xl p-4 md:p-6 rounded-xl overflow-hidden'>
          <Box className='flex justify-between items-center mb-4'>
            <Typography variant="h6" className='font-semibold text-gray-700'>
              Lista de Produtos
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => handleOpenModal(null)}
              sx={{
                display: isMobile ? 'none' : 'flex',
                bgcolor: '#4caf50',
                '&:hover': { bgcolor: '#388e3c' },
              }}
            >
              Novo Produto
            </Button>
          </Box>
          <TableContainer className='h-[60vh] overflow-y-auto relative rounded-lg border border-gray-200'>
            <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nome do Produto</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Preço</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody component={motion.div} initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                <AnimatePresence>
                  {rows.map((row) => (
                    <MotionTableRow
                      key={row.nome}
                      variants={rowVariants}
                      exit="exit"
                      sx={{ '&:hover': { bgcolor: '#fafafa', transition: 'background-color 0.3s' } }}
                    >
                      <TableCell>{row.nome}</TableCell>
                      <TableCell align="right">R$ {row.valor.toFixed(2)}</TableCell>
                      <TableCell align="center">
                        <MotionIconButton
                          variants={iconButtonVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                          color="primary"
                          onClick={() => handleOpenModal(row)}
                        >
                          <ModeEditOutlinedIcon />
                        </MotionIconButton>
                        <MotionIconButton
                          variants={iconButtonVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                          color="error"
                          onClick={() => handleDelete(row.nome)}
                        >
                          <DeleteIcon />
                        </MotionIconButton>
                      </TableCell>
                    </MotionTableRow>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
          <Box className='flex justify-end items-center mt-4 p-2 bg-gray-100 rounded-b-lg border-t border-gray-200'>
            <Typography variant="body1" className='font-bold text-gray-700'>
              Total de Produtos: <span className='text-xl text-blue-600 ml-2'>{rows.length}</span>
            </Typography>
          </Box>
        </Paper>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal(null)}
          sx={{
            display: isMobile ? 'flex' : 'none',
            position: 'fixed',
            bottom: 30,
            right: 30,
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            minWidth: 'auto',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            bgcolor: '#4caf50',
            '&:hover': { bgcolor: '#388e3c' },
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
            },
          }}
        >
          <AddCircleOutlineIcon sx={{ color: 'white' }} />
        </Button>

        <ProductModal
          open={openModal}
          onClose={handleCloseModal}
          onSave={handleSave}
          produto={produtoEdicao}
        />
      </Box>
    </div>
  );
}

export default App2;