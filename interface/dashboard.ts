export interface DashboardSummaryResponse {
    numberOfOrders: number
    paidOrders: number
    notPaidOrders: number
    numberOfClients: number
    numberOfProducts: number
    productWithNoInventory: number
    lowInventory: number
}