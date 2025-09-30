'use client';

import { Box, Container, Heading, Text, VStack, Input, Button, HStack, Card, CardBody, Badge, Divider } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import HeaderNav from '@/components/HeaderNav';

interface QueryResult {
  query: string;
  response: string;
  citations: Array<{
    source: string;
    text: string;
  }>;
}

export default function ChatPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      console.log('Making request to:', `http://localhost:80/laws?query=${encodeURIComponent(query)}`);
      const response = await fetch(`http://localhost:80/laws?query=${encodeURIComponent(query)}`, {
        headers: {
          'mode': 'cors',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      setResults(prev => [data, ...prev]);
      setQuery('');
    } catch (error) {
      console.error('Query failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Query failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  
  return (
    <Box minH="100vh" bg="#FBFBFB">
      <HeaderNav signOut={() => {}} />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading size="lg" mb={2}>
              Legal Query Assistant
            </Heading>
            <Text color="gray.600">
              Ask questions about Westeros laws and get AI-powered answers with citations
            </Text>
          </Box>

          {/* Query Form */}
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                <Input
                    ref={inputRef}
                    value={query}
                    onChange={handleChange}
                    placeholder="Ask about Westeros laws... (e.g., 'What are the laws about slavery?')"
                  />
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    isLoading={loading}
                    loadingText="Searching..."
                    isDisabled={!query.trim() || loading}
                  >
                    Ask Question
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Results */}
          {results.length > 0 && (
            <VStack spacing={4} align="stretch">
              <Divider />
              <Heading size="md">Query Results</Heading>
              
              {results.map((result, index) => (
                <Card key={index}>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {/* Query */}
                      <Box>
                        <Text fontWeight="bold" color="blue.600" mb={2}>
                          Question:
                        </Text>
                        <Text>{result.query}</Text>
                      </Box>

                      {/* Response */}
                      <Box>
                        <Text fontWeight="bold" color="green.600" mb={2}>
                          Answer:
                        </Text>
                        <Text>{result.response}</Text>
                      </Box>

                      {/* Citations */}
                      {result.citations.length > 0 && (
                        <Box>
                          <Text fontWeight="bold" color="purple.600" mb={2}>
                            Sources:
                          </Text>
                          <VStack spacing={2} align="stretch">
                            {result.citations.map((citation, idx) => (
                              <Box key={idx} p={3} bg="gray.50" borderRadius="md">
                                <HStack mb={1}>
                                  <Badge colorScheme="purple" variant="subtle">
                                    Section {citation.source}
                                  </Badge>
                                </HStack>
                                <Text fontSize="sm" color="gray.700">
                                  {citation.text}
                                </Text>
                              </Box>
                            ))}
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          )}

          {/* Empty State */}
          {results.length === 0 && !loading && (
            <Card>
              <CardBody>
                <VStack spacing={4} py={8}>
                  <Text fontSize="lg" color="gray.500" textAlign="center">
                    Start by asking a question about Westeros laws
                  </Text>
                  <VStack spacing={2}>
                    <Text fontSize="sm" color="gray.400">
                      Try these examples:
                    </Text>
                    <Text fontSize="sm" color="blue.500">
                      "What are the laws about slavery?"
                    </Text>
                    <Text fontSize="sm" color="blue.500">
                      "How are trials conducted?"
                    </Text>
                    <Text fontSize="sm" color="blue.500">
                      "What are the tax laws?"
                    </Text>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
