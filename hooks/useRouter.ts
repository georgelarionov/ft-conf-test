import { useRouter as nextRouter } from 'next/router';

export const useRouter = () => {
  const router = nextRouter();
  router.pathname = router.asPath.split('?')[0];
  return router;
};
