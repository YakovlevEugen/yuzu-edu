import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from 'ui/select'
import SvgIcon from '@/components/SvgIcon'
import { IToken, tokens } from '@/constants/currencies'

export default function CurrencySelect({ onChange, ...otherProps }: { onChange: (value: IToken) => void }) {
  return (
    <Select {...otherProps} onValueChange={(v) => onChange?.(v as IToken)}>
      <SelectTrigger className="w-[130px] rounded-[100px] text-xl font-semibold ring-2 ring-black focus:ring-offset-0">
        <SelectValue placeholder="Token" />
      </SelectTrigger>
      <SelectContent className="rounded-2xl ring-1 ring-black">
        <SelectGroup>
          {Object.entries(tokens).map(([key, title]) => (
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
