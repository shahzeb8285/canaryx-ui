import styled from 'styled-components'
import {
  Button,
  Heading,
  Flex,
  PageHeader,
  PageSection,
  Input,
  Text,
  Box,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Link,
  FlexLayout,
  Table,
  Th,
  CardFooter,
  Td,
} from '@pancakeswap/uikit'
import { isMobile } from 'react-device-detect';

import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import { AppBody } from 'components/App'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { SecondaryLabel, FormError } from 'views/Voting/CreateProposal/styles'
import { useEffect, useState } from 'react'
import Dropdown, { Option } from 'react-dropdown';
import 'react-dropdown/style.css';

import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'

import { formatEther, parseUnits } from '@ethersproject/units'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { getContract } from 'utils/contractHelpers'
import { useContract } from 'hooks/useContract'
import WSGBABI from "config/abi/wsgb.json";
import ftsoABI from "config/abi/ftsoABI.json";

import { PercentSlider } from '@pancakeswap/uikit/src/widgets/Liquidity'
import FlexRow from 'views/Predictions/components/FlexRow'
import { AtomBox } from '@pancakeswap/ui'
import { BigNumber } from 'ethers';

const StyledHeader = styled(PageHeader)`
  max-height: max-content;
  margin-bottom: -40px;
  padding-bottom: 40px;
  overflow: hidden;
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: 600px;
  }
`

const Left = styled(Flex)`
  flex-direction: column;
  flex: 1;
`

const Right = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex: 0.5;
  & img {
    height: 50%;
    width: 50%;
    max-height: 330px;
    margin-top: 24px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & img {
      height: auto;
      width: auto;
    }
  }
`

const ftsoProviders = [{ "name": "Bifrost Oracle", "address": "0x69141E890F3a79cd2CFf552c0B71508bE23712dC" }, { "name": "ScandiNodes FTSO", "address": "0x4ed9e5b82CE66311Ac2230D2FCCc5202D7B8c083" }, { "name": "Aureus Ox", "address": "0x6d323e71E141cE2d7b752313C8A654a9C9d1b377" }, { "name": "AlphaOracle", "address": "0xBF61Db1CDb43d196309824473fA82E5B17581159" }, { "name": "FTSO EU", "address": "0x010a16c53F33E4d93892f00897965578b55a8CFC" }, { "name": "FTSO UK", "address": "0xB9b7355f5b71CEE345311921D247b1D2bA5cFe90" }, { "name": "FTSO AU", "address": "0x499017ADB21D6f70480E4E6224cf4144071C1461" }, { "name": "Use Your Spark", "address": "0x53CAEDDA4339eD74272ECfEF85b657dEf18fA2e4" }, { "name": "Sun-Dara", "address": "0x7394923453FC2F606cfb4D0ea1A5438BB8260D08" }, { "name": "Lena Instruments", "address": "0xc9AC8F034d295962A6a975b717B691437605Bbb6" }, { "name": "A-FTSO", "address": "0x2d7bf53ED6117aD1DCD6416d460481522a16aFdf" }, { "name": "Defi Oracles", "address": "0xCa60cd408A5E447897258cDB1F699478c71Cc55E" }, { "name": "uGaenn", "address": "0xb53D69B2519aC9F6D65cff8e7824Bf09F7064D61" }, { "name": "AFOracle", "address": "0x9565d813a3a0CEa62B3bDB9A4e236dCb5910c4f0" }, { "name": "FTSOExpress", "address": "0x33DDAe234e403789954CD792e1feBdBE2466ADC2" }, { "name": "HEWG", "address": "0x819eaB111BD9A6E595187A914240529D2EFfF21f" }, { "name": "FTSO Plus", "address": "0x0FA72D3912d1C530AB1f6a8A9fB61C672947E964" }, { "name": "Flare Oracle", "address": "0x1B00870092a929D160492daf8E734b4bCA033266" }, { "name": "HONO-TSO", "address": "0xa467ACeE8127C55Fb1f4d3b863EA5b0C4F599b9b" }, { "name": "Scintilla", "address": "0xE70d5351a842131c66AAeBC4bD604912BF3cBa72" }, { "name": "LightFTSO", "address": "0xfB9197720329a80191BA140844E96DCcAD149014" }, { "name": "Oracle Daemon", "address": "0x92D6c2E99d5959F2e9c0a7aba5149D8A5ef22f23" }, { "name": "Dione", "address": "0x285430390a72Ce038f6e54BF10f24B94A550474f" }, { "name": "FlareFTSO", "address": "0x4F7f5F8eF4a3CC11f94e875393Ee909Eb5f824ea" }, { "name": "African Proofs", "address": "0xaF31CA175bbE0C6dD667c8403B65a33b28238afa" }, { "name": "FlareFi", "address": "0x5f3C5991De3F0713715a733eE125785D516cEb16" }, { "name": "WitterFTSO", "address": "0xD9200CC419BDe28B169AD8c904d2687a15A4Bf9F" }, { "name": "4DadsFTSO", "address": "0x35D73107A089Ac2b3b14a6681D8c408Aab9568D3" }, { "name": "Aternety", "address": "0x2De2C741658f0Ae7b2DdD8EAdD179911564af119" }, { "name": "1FTSO", "address": "0xeceFe81ff88E5609704697De20Cc36990b76d633" }, { "name": "Flare.Space", "address": "0xCcd522393233052Dd0DfeAadc124a0a9bB87FD08" }, { "name": "FTSO GG", "address": "0x32fE8AC862453DC1B8a390CD3AF821b4FA6fF39D" }, { "name": "Xdrops Oracle", "address": "0x2d3bdE536ad297f2EA74965f02C9E42f4780fB6A" }, { "name": "InGen.FTSO", "address": "0x664e070592063bFE5072F0aC25C6C11e5ccF9928" }, { "name": "PRICEKRAKEN", "address": "0xEF4ef2f3B8C69282846a98341095baa018247553" }, { "name": "Viridissima.es", "address": "0xbADF00D6387958a3E7747C0A0CF5E5a06dcc90c0" }, { "name": "Sparkles FTSO", "address": "0x3012c799565010C3b090D252839a3D24f3b766bE" }, { "name": "FTSO London", "address": "0x0708a4C813594b7E0218CB4A5D8b75c76AbFc859" }, { "name": "Oracle Beast FTSO", "address": "0x3ed7b2cCC4BA420CdcE2BA232d3efdc13075F16D" }, { "name": "Flaris", "address": "0x833DDe54A28a3070A086Cc8919BeAa7a0134DE46" }, { "name": "SignalChamp", "address": "0x263fEca2d46754Aa71BC4Cfc460e8E3055699324" }, { "name": "Tailwind FTSO", "address": "0x04Bd6870d801D68CD58163900B8EED6BDDdA29cB" }, { "name": "Flare Dienst", "address": "0xDe4051b333b3063fd28267Cd4412DD25233D0Ae1" }, { "name": "ACDTftso", "address": "0x86eC5c8Ce7a4DD7762Cff205d64Bfc0C272feB6d" }, { "name": "FTSO Brasil", "address": "0xb9dBa66d8e88c6D620F11Ce32553E0CfBC776926" }, { "name": "EvolveFTSO", "address": "0x0f80AF5b905a9A34f69E74412c4A00B231D26dAa" }, { "name": "Knot Nodes", "address": "0x4619Ae2f09cF5e6da873C501a12D86AaCbD7962B" }, { "name": "Flare Portal", "address": "0x9225db8B30A59D8Dd15448E2E5918BD160262b5D" }, { "name": "FTSO Wales", "address": "0xDD27994108c788613800A8356253Aad99A5DAeD5" }, { "name": "NORTSO", "address": "0x04a8b3171fBbfe4554B55190B43E709c4b672030" }, { "name": "BushiFinance", "address": "0x0d3852Ad415477fFC39ce9351bD4dEdbbd585833" }, { "name": "SSDS", "address": "0x15bC48091332808391ac700A980B12dD4FC266Fb" }, { "name": "Solarius", "address": "0x6c6b3560704Da8A2c33B1BB00E88bA343807E565" }, { "name": "Ugly Kitty", "address": "0x35149714467F2FE71b46eEb4d11689ED8728Bd25" }, { "name": "Wonderftso", "address": "0x78A99Aa32cDe18B33B150941fBF718715d15Af6a" }, { "name": "FTSOCAN", "address": "0x7C255e428e95bEbc76e944D49D4F460C84b3A3c3" }, { "name": "Flare Beacon", "address": "0x633CE03ea66d910c15869e1552fDccC2bf9aAD87" }, { "name": "EDPFTSO", "address": "0x1C602a30335187A97D8061Ffffd4522796DE82bF" }, { "name": "Ivy Oracle", "address": "0xA174D46EF49D7d4a0328f9910222689E9eAb2f45" }, { "name": "SolidiFi FTSO", "address": "0x769530a9F2e4624aE2D6869869d510D4cd55b545" }, { "name": "Envision", "address": "0x58Cd43E9FcdBd4D0F507aB4f6029dB8032746da8" }, { "name": "TheGrungies", "address": "0x2C293599ca61bb53e8fF82c8a19c2A8B883ea23f" }, { "name": "Starlink Oracle", "address": "0xA9a143FEe74E12E97DC794fD1340f851813BDA92" }, { "name": "Aimlezz", "address": "0x0501B6306b03A9EEDe8165d4B9abCB4915937b89" }, { "name": "MyFTSO", "address": "0x399A2dE69e38D93bc397Eb2b1f5487bD25a71C00" }, { "name": "Atlas TSO", "address": "0xB5ECB64526F777Eb6f02D4A83AbAB1FAD26b1C00" }, { "name": "XAWC FTSO", "address": "0x190C6f470A866Db58A6c17631e24b07BE257eAf5" }, { "name": "Odin", "address": "0x8FdBcb218561776759702b175084dBa856282a88" }, { "name": "True FTSO", "address": "0xb6deD9D9CA19af10C67f9A8be8ca75e38E166faA" }, { "name": "Mickey B Fresh", "address": "0xE304AF184b9ca77E3576Aef834A4dc1A43EBfA70" }, { "name": "CFN", "address": "0x889FD8C79FCC81E619b720BD589154C2c9fD74e9" }, { "name": "TempestFTSO", "address": "0x4eb408FA585a5C66E523a4aE5f5706374Ec9E8c7" }, { "name": "sToadz FTSO", "address": "0x6Bf25C0256CBE8969424F6994e19Cf5e0A3C23Bb" }, { "name": "HT Markets FTSO", "address": "0x14d699c1d61d54a0390671B07B2b6f8C0Bf36275" }, { "name": "Flare Ocean", "address": "0xf4213E49488b9320769D35924AC52ea31a4C9fc1" }]

const CreateToken = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { address: account } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [delegationAddress, setDelegationAddress] = useState("")
  const [formData, setFormData] = useState({
    delegationAmount: 0,
  })
  const wbnbAddress = "0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED";
  const { balance: bnbBalance, } = useGetBnbBalance()
  const formattedBnbBalance = parseFloat(formatEther(bnbBalance))
  const { balance: wbnbBalance, } = useTokenBalance(wbnbAddress)
  const formattedWbnbBalance = getBalanceNumber(wbnbBalance)
  const wsgbContract = useContract(wbnbAddress, WSGBABI, true);
  const ftsoAddress = "0x13F7866568dC476cC3522d17C23C35FEDc1431C5"
  const ftsoContract = useContract(ftsoAddress, ftsoABI, true);
  const [pendingReward, setPendingReward] = useState("")
  const [delegations,setDelegations] = useState([])
  const [epochs,setEpochs] = useState([])
  const [formError, setFormError] = useState({
    wgbDelegationError: "",
  })


  useEffect(() => {
    if (ftsoContract && account) {
      loadMyData()
    }
  }, [ftsoContract, account])


  const loadMyData = async () => {
    try {
      const delegationInfo = await wsgbContract.delegatesOf(account)
      const _delegations = []
      for (let i = 0; i < delegationInfo._delegateAddresses.length; i++){
        const provider = ftsoProviders.find((item) => {
          return item.address.toLowerCase() === delegationInfo._delegateAddresses[i].toLowerCase()
        })
        _delegations.push({
          address: delegationInfo._delegateAddresses[i],
          pips: BigNumber.from(delegationInfo._bips[i]).toNumber() / 100,
          providerName:provider.name
        })
      }
      setDelegations(_delegations)
      console.log({ delegationInfo })
      const epochsResp = await ftsoContract.getEpochsWithUnclaimedRewards(account);
      let totalPendingRewards = BigNumber.from("0");
      const rewardStats = [];
      const _epochs  = []
      for (const epoch of epochsResp) {
        _epochs.push(BigNumber.from(epoch).toString())
        // eslint-disable-next-line no-await-in-loop
        const rewardState = await ftsoContract.getStateOfRewards(account, BigNumber.from(epoch).toString())
        for (let i = 0; i < rewardState._dataProviders.length; i++){
          rewardStats.push({
            provider: rewardState._dataProviders[i],
            epoch: BigNumber.from(epoch).toString(),
            claimed: rewardState._claimed[i],
            rewardAmount: BigNumber.from(rewardState._rewardAmounts[i])
          })
        }
      }

      setEpochs(_epochs)
      for (const rewardState of rewardStats) {
        if (!rewardState.claimed) {
          totalPendingRewards = rewardState.rewardAmount.add(totalPendingRewards)
        }
      }

      setPendingReward(Number(formatEther(totalPendingRewards)).toFixed(4))
     
    
    } catch (err) {
      console.error(err)
    }
  }


  const validate = () => {
    let isError = false;
    let errors = {
      wgbDelegationError: ""
    }
    if (!formData.delegationAmount) {
      errors = {
        ...errors,
        wgbDelegationError: "Enter Valid Delegation Amount"
      }
      isError = true
    } else if (!delegationAddress) {
      errors = {
        ...errors,
        wgbDelegationError: "Please Select Provider"
      }
      isError = true
    } else if (delegations.length === 2) {
      errors = {
        ...errors,
        wgbDelegationError: "Max Delegation Exceeds "
      }
      isError = true
    } else {
      const pipsRaw = formData.delegationAmount * 10000 / formattedWbnbBalance
      if (pipsRaw > 10000) {
        errors = {
          ...errors,
          wgbDelegationError: "Not Enough WSGB Balance"
        }
        isError = true
      }
    }

    setFormError(errors)

    return !isError
  }


  const handleClaim = async () => {
    setIsLoading(true)
    try {
      const txn = await ftsoContract.claimReward(account, [...epochs]);
      await txn.wait("1")
      await loadMyData()
    } catch (err) {
      console.error(err)

    }
    setIsLoading(false)

  }


  const unDelegate = async () => {
    setIsLoading(true)
    try {
      const resp = await wsgbContract.undelegateAll();
      await resp.wait("1")
      await loadMyData()

    } catch (err) {
      console.error(err)

    }
    setIsLoading(false)

  }


  const handleSubmit = async () => {
    const isValid = validate()
    setIsLoading(true)
    if (isValid) {

      try {
        const pipsRaw = formData.delegationAmount * 10000 / formattedWbnbBalance
        const pips = parseInt(pipsRaw.toString());
        const resp = await wsgbContract.delegate(delegationAddress, pips);
        await resp.wait("1")

        await loadMyData()
      } catch (err) {
        console.error(err)
      }
    }

    setIsLoading(false)
  }

  const getDropdownOptions = () => {
    const options = []

    for (const provider of ftsoProviders) {
      options.push({
        value: provider.address, label: provider.name
      }
      )
    }
    return options
  }
  return (
    <>
      <StyledHeader>

        <Flex flexDirection={['column-reverse', null, 'row']}>
          <Left>
            <Heading as="h1" scale="xxl" my="24px">
              Delegate Your WSGB
            </Heading>
          </Left>

        </Flex>
      </StyledHeader>
      <>
        <PageSection
          innerProps={{ style: { margin: '0', width: '100%', } }}
          background={theme.colors.background}
          // p="24px 0"
          index={2}
          concaveDivider
          dividerPosition="top"
        >
          <AppBody >
            <Box width="100%"
              style={{
                // background: "red",
                width: "100%",
                display: "flex"
              }}
              className='testtest'
            >
              <Card style={{
                width: "100%"
              }}>
                <CardHeader>
                  <Heading as="h3" scale="md">
                    SGB Delegation
                  </Heading>
                </CardHeader>

                <CardBody>


                  <div style={{ display: isMobile ? "block" : "flex", justifyContent: "space-between" }}>
                    <div style={{ width: isMobile ? "100%" : "80%" }}>
                      <Box mb="24px">
                        <SecondaryLabel>SGB Balance:</SecondaryLabel>
                        <Input
                          disabled

                          value={formattedBnbBalance}
                          placeholder="0"
                        />

                      </Box>

                      <Box mb="24px">
                        <SecondaryLabel>WSGB Balance:</SecondaryLabel>
                        <Input
                          disabled
                          value={formattedWbnbBalance}
                          placeholder="0"
                        />
                        <Link
                          external
                          m="0 4px"
                          fontSize="12px"
                          color="warning"
                          href="/swap?chain=songbird&outputCurrency=0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED"
                          style={{ textDecoration: 'underline' }}
                        >
                          Convert SGB To WSGB
                        </Link>
                      </Box>


                      <Box mb="24px">
                        <SecondaryLabel>Select Provider:</SecondaryLabel>
                        <Dropdown options={getDropdownOptions()} onChange={(item: Option) => {
                          if (item && item.value) {
                            setDelegationAddress(item?.value)
                          }
                        }} placeholder="Select an option" />

                      </Box>
                      <Box mb="24px">
                        <SecondaryLabel>Enter WSGB Delegation Amount</SecondaryLabel>
                        <Input
                          type='number'

                          onChange={(e) => setFormData({ ...formData, delegationAmount: Number(e.target.value) })}
                          value={formData.delegationAmount.toString()}
                          // onChange={handleDateChange('startTime')}
                          placeholder="i.e 100000"
                        />

                        <PercentSlider

                          onValueChanged={(e) => {
                            const _inputAmount = formattedWbnbBalance * Number(e) / 100;
                            setFormData({ ...formData, delegationAmount: Number(_inputAmount) })
                          }}
                          currentValue={formData.delegationAmount * 100 / formattedWbnbBalance}
                        />
                        <FormError>{formError.wgbDelegationError}</FormError>

                      </Box>


                      {account && (
                        <>
                          <Button
                            type="submit"
                            width="100%"
                            isLoading={isLoading}
                            onClick={(e) => {
                              e.preventDefault()
                              handleSubmit()
                            }}
                            mb="16px"
                          >
                            Delegate
                          </Button>




                        </>
                      )}

                    </div>

                    <div style={{ width: "100%", marginLeft: isMobile ? 0 : 10 }}>
                      {/* <Box mb="24px">
                        <SecondaryLabel>Delegated WSGB Balance:</SecondaryLabel>
                        <Input
                          disabled

                          value={formattedBnbBalance}
                          placeholder="0"
                        />

                      </Box> */}



                      {account &&              <Card>
                        <CardBody>
                        <Table>
                        <thead>
                          <Th >
                            <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left" >
                              Provider
                            </Text>
                          </Th>
                          <Th >
                            <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                              Delegated Percent
                            </Text>
                          </Th>
                          <Th />
                        </thead>
                            <tbody>
                              {delegations.map((item, index) => {
                                // eslint-disable-next-line react/no-array-index-key
                                return <tr key={index}>
                                   <Td>
                                    <Text fontSize="14px">
                                      {item.providerName}
                                      {item.address}
                              </Text>
                                  </Td>
                                <Td>
                                <Text fontSize="14px">
                                      {item.pips}%
                              </Text>
                            </Td>
                                </tr>
                              })}
                          {/* {feeList.map((fee) => (
                          <tr key={fee.id}>
                            <Td>
                              <Text fontSize="14px">
                                {generateLink({ linkId: fee.linkId, percentage: fee.v2SwapFee })}
                              </Text>
                            </Td>
                            <Td>
                              <Text textAlign="right" fontSize="14px">{`${fee.v2SwapFee}%`}</Text>
                            </Td>
                            <Td>
                              <Box width="24px" ml="auto">
                                <CopyIcon
                                  color="textSubtle"
                                  cursor="pointer"
                                  width={24}
                                  height={24}
                                  onClick={() =>
                                    copyText(generateLink({ linkId: fee.linkId, percentage: fee.v2SwapFee }))
                                  }
                                />
                              </Box>
                            </Td>
                          </tr>
                        ))} */}
                        </tbody>
                      </Table>

                        </CardBody>
                        <CardFooter>
                        <Button
                          type="submit"
                          width="100%"
                          isLoading={isLoading}
                          onClick={(e) => {
                            e.preventDefault()
                            unDelegate()
                          }}
                          mb="16px"
                        >
                          Undelegate All
                        </Button>




                        <Button
                          type="submit"
                          width="100%"
                          disabled={Number.isNaN(Number(pendingReward))}
                          isLoading={isLoading}
                          onClick={(e) => {
                            e.preventDefault()
                            handleClaim()
                          }}
                          mb="16px"
                        >
                          Claim {pendingReward &&  pendingReward  } SGB Reward
                        </Button>
                        </CardFooter>
                      </Card>
               
}


                    </div>


                  </div>

                  {!account && <ConnectWalletButton width="100%" type="button" />}
                </CardBody>
              </Card>

            </Box>

          </AppBody>
        </PageSection>

      </>
    </>
  )
}

export default CreateToken
