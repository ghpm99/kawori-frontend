import { render } from '@testing-library/react'
import Cards from "@/components/overview/cards"

it('renders homepage unchanged', () => {
  const { container } = render(<Cards loading={false} amountPayment={1000.00} amountPaymentClosed={1} amountPaymentOpen={1} countPayment={1} />)
  expect(container).toMatchSnapshot()
})