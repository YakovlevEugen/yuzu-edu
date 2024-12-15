import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from 'ui/select'
import SvgIcon from '@/components/SvgIcon'

import { CURRENCY_TOKEN } from '@/constants/currencies'
import { TTransferTabId } from '@/pages/BridgePage/components/Transfer/components/TransferTabs'

interface Props {
  onChange: (value: TTransferTabId) => void
}

export default function CurrencySelect({ onChange, ...otherProps }: Props) {
  const options = Object.entries(CURRENCY_TOKEN)

  function handleChange(value: string) {
    onChange?.(value as TTransferTabId)
  }

  return (
    <Select {...otherProps} onValueChange={handleChange}>
      <SelectTrigger className="w-[130px] rounded-[100px] text-xl font-semibold ring-2 ring-black focus:ring-offset-0">
        <SelectValue placeholder="Token" />
      </SelectTrigger>
      <SelectContent className="rounded-2xl ring-1 ring-black">
        <SelectGroup>
          {options.map(([key, title]) => (
            <SelectItem value={key}>
              <div className="flex w-[130px] items-center gap-x-2 text-lg">
                <SvgIcon name={key} />
                <span>{title}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
