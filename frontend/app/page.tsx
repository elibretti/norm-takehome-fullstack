'use client';

import { Box, Container, Heading, Text, VStack, Button, HStack, Card, CardBody, SimpleGrid } from '@chakra-ui/react';
import { FiSearch, FiFileText, FiMessageCircle } from 'react-icons/fi';
import HeaderNav from '@/components/HeaderNav';
import Link from 'next/link';

export default function HomePage() {

  return (
    <Box minH="100vh" bg="#FBFBFB">
      <HeaderNav signOut={() => {}} />
      <Container maxW="container.xl" py={12}>
        <VStack spacing={12} align="stretch">
          {/* Hero Section */}
          <VStack spacing={6} textAlign="center">
            <Heading size="2xl" color="gray.800">
              Westeros Legal Research
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="2xl">
              AI-powered legal research for the Seven Kingdoms. Ask questions about laws, 
              get instant answers with citations, and explore the complete legal code.
            </Text>
            <HStack spacing={4}>
              <Link href="/chat">
                <Button colorScheme="blue" size="lg" leftIcon={<FiMessageCircle />}>
                  Start New Query
                </Button>
              </Link>
              <Link href="/documents">
                <Button variant="outline" size="lg" leftIcon={<FiFileText />}>
                  Browse Documents
                </Button>
              </Link>
            </HStack>
          </VStack>

          {/* Features */}
          <Card>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                <VStack textAlign="center">
                  <Box p={3} bg="blue.100" borderRadius="full">
                    <FiSearch size={24} color="#3182ce" />
                  </Box>
                  <Heading size="md">Smart Search</Heading>
                  <Text color="gray.600">
                    Natural language queries with AI-powered understanding
                  </Text>
                </VStack>
                <VStack textAlign="center">
                  <Box p={3} bg="green.100" borderRadius="full">
                    <FiFileText size={24} color="#38a169" />
                  </Box>
                  <Heading size="md">Source Citations</Heading>
                  <Text color="gray.600">
                    Every answer includes references to specific legal sections
                  </Text>
                </VStack>
                <VStack textAlign="center">
                  <Box p={3} bg="purple.100" borderRadius="full">
                    <FiMessageCircle size={24} color="#805ad5" />
                  </Box>
                  <Heading size="md">Interactive Chat</Heading>
                  <Text color="gray.600">
                    Follow-up questions and conversation-based research
                  </Text>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
