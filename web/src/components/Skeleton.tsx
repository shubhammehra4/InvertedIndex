import {
  Box,
  VStack,
  HStack,
  SkeletonCircle,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";

export default function BookSkeleton() {
  return (
    <Box>
      <VStack spacing="8">
        {[1, 2].map((ele) => {
          return (
            <Box
              key={`EventSkeleton:${ele}`}
              p="8"
              shadow="md"
              rounded="xl"
              w="full"
              minH="200px"
            >
              <HStack alignItems="start">
                <Box>
                  <SkeletonCircle size="20" />
                </Box>
                <Skeleton height="1.5em" w="30%" />
              </HStack>
              <SkeletonText pt="3" rounded="full" />
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
