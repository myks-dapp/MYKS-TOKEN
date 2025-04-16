'use client';

import {
  useAddress,
  useMetamask,
  useTokenBalance,
  useContract,
  useToken,
} from '@thirdweb-dev/react';
import { useEffect, useState } from 'react';
import { MYKS_CONTRACT } from "@/constants/contracts";
import TokenInfo from '@/components/TokenInfo';
import BuyForm from '@/components/BuyForm';
import LoadingContracts from '@/components/LoadingContracts';
import {
  TOKEN_CONTRACT,
  SALE_CONTRACT,
} from '@/constants/contracts';
import { Token } from '@thirdweb-dev/sdk';

type Phase = {
  name: string;
  start: number;
  end: number;
  price: number;
};

const phases: Phase[] = [
  {
    name: 'Presale Phase 1',
    start: new Date('2025-05-01T00:00:00Z').getTime(),
    end: new Date('2025-05-09T23:59:59Z').getTime(),
    price: 0.5,
  },
  {
    name: 'Presale Phase 2',
    start: new Date('2025-05-10T00:00:00Z').getTime(),
    end: new Date('2025-05-19T23:59:59Z').getTime(),
    price: 2,
  },
  {
    name: 'Presale Phase 3',
    start: new Date('2025-05-20T00:00:00Z').getTime(),
    end: new Date('2025-05-24T23:59:59Z').getTime(),
    price: 5,
  },
];

const getCurrentPhase = (now: number): Phase | null =>
  phases.find((phase) => now >= phase.start && now <= phase.end) || null;

export default function BuyPage() {
  const address = useAddress();
  const connect = useMetamask();

  const tokenData = useToken(TOKEN_CONTRACT) as {
    contract: Token | undefined;
    isLoading: boolean;
  };

  const tokenContract = tokenData.contract;
  const loadingToken = tokenData.isLoading;

  const { contract: saleContract, isLoading: loadingSale } = useContract(SALE_CONTRACT);
  const { data: balance } = useTokenBalance(tokenContract, address);

  const [phase, setPhase] = useState<Phase | null>(null);
  const [amount, setAmount] = useState<number>(1);

  useEffect(() => {
    const now = Date.now();
    const current = getCurrentPhase(now);
    setPhase(current);
  }, []);

  if (!tokenContract || !saleContract || loadingToken || loadingSale) {
    return <LoadingContracts />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        Buy MYKS Tokens
      </h1>

      {phase ? (
        <>
          <TokenInfo address={address} phase={phase} balance={balance} />
          <BuyForm
            address={address}
            connect={connect}
            saleContractAddress={SALE_CONTRACT}
            amount={amount}
            setAmount={setAmount}
            price={phase.price}
          />
        </>
      ) : (
        <p className="text-red-500 text-lg font-medium text-center">
          Presale is currently inactive. Please check back during the official sale period.
        </p>
      )}
    </div>
  );
}
