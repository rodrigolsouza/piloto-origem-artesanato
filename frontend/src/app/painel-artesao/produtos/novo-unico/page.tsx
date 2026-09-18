'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Flex, 
  Grid, 
  Text, 
  Input, 
  Select, 
  Textarea, 
  FormControl, 
  FormLabel, 
  Alert, 
  AlertIcon, 
  Badge,
  useToast
} from '@chakra-ui/react';
import { 
  Image as ImageIcon, 
  Lock, 
  Bold, 
  Italic, 
  List, 
  Link2, 
  Eye, 
  TrendingUp, 
  HelpCircle,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/produto/ProductCard';
import { produtosService } from '@/services/produtos.service';
import { CriarProdutoDTO } from '@/types/produto';

export default function NovoProdutoUnicoPage() {
  const router = useRouter();
  const toast = useToast();

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Cerâmica');
  const [regiaoProducao, setRegiaoProducao] = useState('Caruaru, PE');
  const [descricao, setDescricao] = useState('');
  const [materiaPrima, setMateriaPrima] = useState('');
  const [tecnica, setTecnica] = useState('');
  const [preco, setPreco] = useState('');
  const [sku, setSku] = useState('');
  const [prazoProducao, setPrazoProducao] = useState('0');
  const [nomeArtesao, setNomeArtesao] = useState('');
  const [guiaCuidados, setGuiaCuidados] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');

  const [altura, setAltura] = useState('');
  const [largura, setLargura] = useState('');
  const [profundidade, setProfundidade] = useState('');
  const [peso, setPeso] = useState('');

  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroValidacao(null);

    // Regra do Cenário 2 (PI4-91): Descrição obrigatória
    if (!descricao.trim()) {
      setErroValidacao('A descrição e história da peça é obrigatória para prosseguir com o cadastro.');
      return;
    }

    if (!titulo.trim() || !preco || Number(preco) <= 0) {
      setErroValidacao('Preencha o título e informe um preço válido maior que zero.');
      return;
    }

    try {
      setCarregando(true);

      const novoId = `prod-${Date.now().toString().slice(-3)}`;

      const payload: CriarProdutoDTO & { id: string } = {
        id: novoId,
        sku: sku.trim() || `UNI-${Date.now().toString().slice(-4)}`,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        materiaPrima: materiaPrima.trim() || 'Argila regional cozida',
        tecnica: tecnica.trim() || 'Modelagem artesanal',
        regiaoProducao,
        categoria,
        preco: parseFloat(preco),
        tipo: 'unico', // Modalidade exclusiva
        quantidadeEstoque: 1, // Estoque fixo em 1
        idArtesao: 'art-001',
        nomeArtesao: nomeArtesao.trim() || 'Severino Vitalino',
        dimensoes: {
          altura: parseFloat(altura) || 15,
          largura: parseFloat(largura) || 15,
          profundidade: parseFloat(profundidade) || 10,
          peso: parseFloat(peso) || 0.8,
        },
        guiaCuidados: guiaCuidados.trim() || 'Limpar com flanela seca. Proteger de umidade.',
        galeriaImagens: imagemUrl.trim()
          ? [imagemUrl.trim()]
          : ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'],
        prazoProducao: parseInt(prazoProducao, 10) || 0,
        ativo: true,
      };

      const novoProduto = await produtosService.criar(payload);

      toast({
        title: 'Peça Única cadastrada com sucesso!',
        description: `${novoProduto.titulo} já está disponível na vitrine.`,
        status: 'success',
        duration: 3500,
        isClosable: true,
      });

      router.push(`/produtos/${novoProduto.id}`);
    } catch (err) {
      setErroValidacao('Erro ao conectar com a Fake API. Verifique se o comando npm run api está ativo.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Box maxW="7xl" mx="auto" px={{ base: 4, lg: 8 }} py={8}>
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(12, 1fr)' }} gap={8} alignItems="start">
        
        {/* Coluna Esquerda: Stepper / Progresso com Ícone de Check */}
        <Box as="aside" gridColumn={{ lg: 'span 3' }}>
          <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200" p={5} position="sticky" top="20px">
            <Text fontWeight="bold" fontSize="sm" color="gray.900" mb={1}>
              Cadastrar Peça Única
            </Text>
            <Text fontSize="2xs" color="gray.400" mb={6}>
              Siga as seções para disponibilizar a obra no catálogo artesanal.
            </Text>

            <Flex direction="column" gap={4} fontSize="xs" color="gray.600">
              <Flex align="center" gap={2.5} fontWeight="bold" color="gray.900">
                <Flex w={5} h={5} borderRadius="full" bg="brand.yellow" color="brand.dark" align="center" justify="center">
                  <Check size={12} strokeWidth={3} />
                </Flex>
                Informações Básicas
              </Flex>
              <Flex align="center" gap={2.5}>
                <Flex w={5} h={5} borderRadius="full" bg="gray.100" color="gray.600" align="center" justify="center" fontSize="2xs">2</Flex>
                Fotos da Peça
              </Flex>
              <Flex align="center" gap={2.5}>
                <Flex w={5} h={5} borderRadius="full" bg="gray.100" color="gray.600" align="center" justify="center" fontSize="2xs">3</Flex>
                História & Descrição
              </Flex>
              <Flex align="center" gap={2.5}>
                <Flex w={5} h={5} borderRadius="full" bg="gray.100" color="gray.600" align="center" justify="center" fontSize="2xs">4</Flex>
                Materiais & Dimensões
              </Flex>
              <Flex align="center" gap={2.5}>
                <Flex w={5} h={5} borderRadius="full" bg="gray.100" color="gray.600" align="center" justify="center" fontSize="2xs">5</Flex>
                Preço & Estoque Único
              </Flex>
            </Flex>
          </Box>
        </Box>

        {/* Coluna Central: Formulário */}
        <Box as="main" gridColumn={{ lg: 'span 6' }}>
          {erroValidacao && (
            <Alert status="error" borderRadius="xl" mb={6} fontSize="xs">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Atenção ao preenchimento:</Text>
                <Text>{erroValidacao}</Text>
              </Box>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap={6}>
              
              {/* Seção 1: Informações Básicas */}
              <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200" p={6}>
                <Flex justify="space-between" align="center" pb={2} mb={4} borderBottomWidth="1px" borderColor="gray.100">
                  <Text fontWeight="bold" fontSize="sm" color="gray.900">1. Informações Básicas</Text>
                  <Badge bg="amber.50" color="amber.800" fontSize="2xs">Peça Única</Badge>
                </Flex>

                <FormControl isRequired mb={4}>
                  <FormLabel fontSize="xs" fontWeight="semibold">Título da Peça</FormLabel>
                  <Input
                    fontSize="xs"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Escultura Mestre Vitalino em Barro Cozido"
                  />
                </FormControl>

                <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
                  <FormControl>
                    <FormLabel fontSize="xs" fontWeight="semibold">Categoria</FormLabel>
                    <Select fontSize="xs" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                      <option value="Cerâmica">Cerâmica</option>
                      <option value="Madeira">Madeira</option>
                      <option value="Têxtil & Renda">Têxtil & Renda</option>
                      <option value="Xilogravura">Xilogravura</option>
                      <option value="Couro">Couro</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="xs" fontWeight="semibold">Polo de Origem</FormLabel>
                    <Select fontSize="xs" value={regiaoProducao} onChange={(e) => setRegiaoProducao(e.target.value)}>
                      <option value="Caruaru, PE">Caruaru, PE</option>
                      <option value="Olinda, PE">Olinda, PE</option>
                      <option value="Bezerros, PE">Bezerros, PE</option>
                      <option value="Pesqueira, PE">Pesqueira, PE</option>
                      <option value="Tracunhaém, PE">Tracunhaém, PE</option>
                      <option value="Recife, PE">Recife, PE</option>
                    </Select>
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="semibold">Nome do Artesão</FormLabel>
                  <Input
                    fontSize="xs"
                    value={nomeArtesao}
                    onChange={(e) => setNomeArtesao(e.target.value)}
                    placeholder="Ex: Mestre Severino"
                  />
                </FormControl>
              </Box>

              {/* Seção 2: Fotos com destaque da capa */}
              <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200" p={6}>
                <Flex justify="space-between" align="center" pb={2} mb={4} borderBottomWidth="1px" borderColor="gray.100">
                  <Text fontWeight="bold" fontSize="sm" color="gray.900">2. Fotos da Peça</Text>
                  <Text fontSize="2xs" color="gray.400">Proporção 1:1 quadrada</Text>
                </Flex>

                <FormControl mb={4}>
                  <FormLabel fontSize="xs" fontWeight="semibold">URL da Imagem Principal</FormLabel>
                  <Input
                    fontSize="xs"
                    value={imagemUrl}
                    onChange={(e) => setImagemUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </FormControl>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(12, 1fr)' }} gap={4}>
                  <Box gridColumn={{ md: 'span 7' }} position="relative" pt="80%" bg="gray.50" borderRadius="lg" borderWidth="2px" borderStyle="dashed" borderColor="gray.300" overflow="hidden">
                    {imagemUrl ? (
                      <Box as="img" src={imagemUrl} alt="Capa" position="absolute" top={0} left={0} w="full" h="full" objectFit="cover" />
                    ) : (
                      <Flex direction="column" align="center" justify="center" position="absolute" top={0} left={0} w="full" h="full" color="gray.400">
                        <ImageIcon size={32} />
                        <Text fontSize="2xs" mt={1}>Foto de Capa Principal</Text>
                      </Flex>
                    )}
                  </Box>

                  <Box gridColumn={{ md: 'span 5' }}>
                    <Text fontSize="2xs" fontWeight="bold" color="gray.600" mb={2}>Fotos Secundárias</Text>
                    <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                      {[1, 2, 3].map((slot) => (
                        <Flex key={slot} pt="100%" position="relative" bg="gray.50" borderRadius="md" borderWidth="1px" borderColor="gray.200" align="center" justify="center">
                          <Text position="absolute" top="35%" fontSize="2xs" color="gray.400">Slot {slot + 1}</Text>
                        </Flex>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
              </Box>

              {/* Seção 3: História & Descrição (PI4-91) */}
              <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200" p={6}>
                <Flex justify="space-between" align="center" pb={2} mb={3} borderBottomWidth="1px" borderColor="gray.100">
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.900">3. História & Descrição *</Text>
                    <Text fontSize="2xs" color="gray.400">Contexto cultural e narrativa manual</Text>
                  </Box>
                  <Badge colorScheme="red" fontSize="2xs">Obrigatório</Badge>
                </Flex>

                <Flex gap={1} p={1.5} bg="gray.50" borderWidth="1px" borderColor="gray.200" borderTopRadius="md" color="gray.600">
                  <Box as="button" type="button" p={1} _hover={{ bg: 'gray.200' }} borderRadius="sm"><Bold size={13} /></Box>
                  <Box as="button" type="button" p={1} _hover={{ bg: 'gray.200' }} borderRadius="sm"><Italic size={13} /></Box>
                  <Box as="button" type="button" p={1} _hover={{ bg: 'gray.200' }} borderRadius="sm"><List size={13} /></Box>
                  <Box as="button" type="button" p={1} _hover={{ bg: 'gray.200' }} borderRadius="sm"><Link2 size={13} /></Box>
                </Flex>

                <Textarea
                  rows={5}
                  borderTopRadius={0}
                  fontSize="xs"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva a história por trás desta obra artesanal exclusiva..."
                  borderColor={erroValidacao && !descricao.trim() ? 'red.400' : 'gray.200'}
                  bg={erroValidacao && !descricao.trim() ? 'red.50' : 'white'}
                />
              </Box>

              {/* Seção 4: Materiais e Dimensões */}
              <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200" p={6}>
                <Text fontWeight="bold" fontSize="sm" color="gray.900" pb={2} mb={4} borderBottomWidth="1px" borderColor="gray.100">
                  4. Materiais & Dimensões
                </Text>

                <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
                  <FormControl>
                    <FormLabel fontSize="xs" fontWeight="semibold">Matéria-Prima</FormLabel>
                    <Input fontSize="xs" value={materiaPrima} onChange={(e) => setMateriaPrima(e.target.value)} placeholder="Ex: Argila e pigmento mineral" />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="xs" fontWeight="semibold">Técnica</FormLabel>
                    <Input fontSize="xs" value={tecnica} onChange={(e) => setTecnica(e.target.value)} placeholder="Ex: Modelagem manual figurativa" />
                  </FormControl>
                </Grid>

                <Grid templateColumns="repeat(4, 1fr)" gap={3} mb={4}>
                  <FormControl>
                    <FormLabel fontSize="2xs" color="gray.600">Altura (cm)</FormLabel>
                    <Input fontSize="xs" type="number" value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="18" />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="2xs" color="gray.600">Largura (cm)</FormLabel>
                    <Input fontSize="xs" type="number" value={largura} onChange={(e) => setLargura(e.target.value)} placeholder="20" />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="2xs" color="gray.600">Prof. (cm)</FormLabel>
                    <Input fontSize="xs" type="number" value={profundidade} onChange={(e) => setProfundidade(e.target.value)} placeholder="12" />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="2xs" color="gray.600">Peso (kg)</FormLabel>
                    <Input fontSize="xs" type="number" step="0.01" value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="1.2" />
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="semibold">Instruções de Cuidados</FormLabel>
                  <Input fontSize="xs" value={guiaCuidados} onChange={(e) => setGuiaCuidados(e.target.value)} placeholder="Ex: Limpar com flanela seca. Evitar quedas." />
                </FormControl>
              </Box>

              {/* Seção 5: Preço & Estoque (PI4-90) */}
              <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200" p={6}>
                <Text fontWeight="bold" fontSize="sm" color="gray.900" pb={2} mb={4} borderBottomWidth="1px" borderColor="gray.100">
                  5. Preço & Controle de Estoque
                </Text>

                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  <FormControl isRequired>
                    <FormLabel fontSize="xs" fontWeight="semibold">Preço (R$)</FormLabel>
                    <Input fontSize="xs" type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="140.00" fontWeight="bold" />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="xs" fontWeight="semibold" display="flex" alignItems="center" gap={1}>
                      Estoque <Lock size={12} color="#718096" />
                    </FormLabel>
                    <Input fontSize="xs" value="1 un. (Travado)" isReadOnly bg="gray.100" color="gray.500" fontWeight="bold" />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="xs" fontWeight="semibold">SKU</FormLabel>
                    <Input fontSize="xs" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Ex: CAR-BAR-001" />
                  </FormControl>
                </Grid>
              </Box>

              {/* Botão com Cor Preta Institucional */}
              <Flex justify="flex-end">
                <Button type="submit" variantStyle="primary" isLoading={carregando}>
                  Publicar Peça Única
                </Button>
              </Flex>
            </Flex>
          </form>
        </Box>

        {/* Coluna Direita: Live Preview */}
        <Box as="aside" gridColumn={{ lg: 'span 3' }}>
          <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200" p={5} position="sticky" top="20px">
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontWeight="bold" fontSize="xs" color="gray.800" display="flex" alignItems="center" gap={1.5}>
                <Eye size={14} /> Pré-visualização
              </Text>
              <Text fontSize="2xs" color="gray.400">Tempo real</Text>
            </Flex>

            <Box mb={4}>
              <ProductCard
                titulo={titulo || 'Título da Peça'}
                preco={preco || '0'}
                regiaoProducao={regiaoProducao}
                nomeArtesao={nomeArtesao || 'Mestre Artesão'}
                tipo="unico"
                imagemUrl={imagemUrl}
                isLink={false}
              />
            </Box>

            <Flex direction="column" gap={3} pt={3} borderTopWidth="1px" borderColor="gray.100" fontSize="2xs" color="gray.500">
              <Flex align="center" gap={2}>
                <TrendingUp size={14} color="#38A169" />
                <Text>Obras com história cultural têm maior conversão.</Text>
              </Flex>
              <Flex align="center" gap={2}>
                <HelpCircle size={14} color="#D97706" />
                <Text>Fotografias nítidas reforçam o valor artesanal.</Text>
              </Flex>
            </Flex>
          </Box>
        </Box>

      </Grid>
    </Box>
  );
}