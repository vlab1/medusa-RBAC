import {
  TableOptions,
  usePagination,
  useRowSelect,
  useTable,
} from "react-table"
import React, { forwardRef, useEffect, useImperativeHandle } from "react"
import Table from "../../../components/molecules/table"
import TableContainer from "../../../components/organisms/table-container"
import IndeterminateCheckbox from "../../../components/molecules/indeterminate-checkbox"
import { TablePagination } from "../../../components/organisms/table-container/pagination"
import clsx from "clsx"

const LIMIT = 12
const COLUMNS = [
  {
    width: 30,
    id: "selection",
    Header: ({ getToggleAllPageRowsSelectedProps }) => (
      <span className="flex w-[30px] justify-center">
        <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
      </span>
    ),
    Cell: ({ row }) => {
      return (
        <span
          onClick={(e) => e.stopPropagation()}
          className="flex w-[30px] justify-center"
        >
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        </span>
      )
    },
  },
  {
    Header: "Name",
    accessor: "name",
    Cell: ({ row }) => {
      return (
        <span title={row.original.name}>{row.original.name}</span>
      )
    },
  },
  {
    Header: "Endpoint",
    accessor: "metadata",
    Cell: ({ row }) => {
      const metadataKeys = Object.keys(row.original.metadata);
      const metadataString = metadataKeys.join(", ");
      return (
        <span title={`${metadataString}`}>{metadataString}</span>
      )
    },
  },
];



type PermissionTableProps = {
  query: string
  selectedChannels: any
  setSelectedChannels: any
  offset: number
  setOffset: (offset: number) => void
  data: any[]
  isLoading: boolean
  count: number
}

/**
 * Sales channels select table.
 */
const PermissionsTable = forwardRef(
  (props: PermissionTableProps, ref: React.Ref<any>) => {
    const {
      query,
      offset,
      data,
      isLoading,
      count,
      setOffset,
      selectedChannels,
      setSelectedChannels,
    } = props

    const tableConfig: TableOptions<any> = {
      data,
      // @ts-ignore
      columns: COLUMNS,
      autoResetPage: false,
      manualPagination: true,
      autoResetSelectedRows: false,
      initialState: {
        pageIndex: Math.floor(offset / LIMIT),
        pageSize: LIMIT,
        selectedRowIds: Object.keys(selectedChannels).reduce((prev, k) => {
          prev[k] = true
          return prev
        }, {}),
      },
      pageCount: Math.ceil(count / LIMIT),
      getRowId: (row) => row.id,
    }

    const table = useTable(tableConfig, usePagination, useRowSelect)

    useEffect(() => {
      setSelectedChannels((oldState) => {
        const newState = {}

        Object.keys(table.state.selectedRowIds).forEach((k) => {
          newState[k] = oldState[k] || data.find((d) => d.id === k)
        })
        return newState
      })
    }, [table.state.selectedRowIds, data])

    useEffect(() => {
      setOffset(0)
      table.gotoPage(0)
    }, [query])

    const handleNext = () => {
      if (table.canNextPage) {
        setOffset(offset + LIMIT)
        table.nextPage()
      }
    }

    const handlePrev = () => {
      if (table.canPreviousPage) {
        setOffset(Math.max(offset - LIMIT, 0))
        table.previousPage()
      }
    }

    useImperativeHandle(ref, () => ({
      toggleAllRowsSelected: table.toggleAllRowsSelected,
      toggleRowSelected: table.toggleRowSelected,
    }))

    return (
      <>
        <TableContainer
          hasPagination
          numberOfRows={LIMIT}
          isLoading={isLoading}
        >
          <Table {...table.getTableProps()}>
            <Table.Head>
              {table.headerGroups?.map((headerGroup) => (
                <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((col) => (
                    <Table.HeadCell
                      {...col.getHeaderProps({
                        style: { width: col.width, maxWidth: col.maxWidth },
                      })}
                    >
                      {col.render("Header")}
                    </Table.HeadCell>
                  ))}
                </Table.HeadRow>
              ))}
            </Table.Head>
            <Table.Body {...table.getTableBodyProps()}>
              {table.rows.map((row) => {
                table.prepareRow(row)
                return (
                  <Table.Row
                    color="inherit"
                    onClick={() => table.toggleRowSelected(row.id)}
                    className={clsx("cursor-pointer", {
                      "bg-grey-5": row.isSelected,
                    })}
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <Table.Cell
                          {...cell.getCellProps({
                            style: {
                              width: cell.column.width,
                              maxWidth: cell.column.maxWidth,
                            },
                          })}
                        >
                          {cell.render("Cell")}
                        </Table.Cell>
                      )
                    })}
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>

          {!isLoading && !data?.length && (
            <div className="absolute flex h-full w-full items-center justify-center">
              <span className="text-sma text-grey-40">
                No added permissions
              </span>
            </div>
          )}
        </TableContainer>
        <div className="absolute w-[506px]" style={{ bottom: 100 }}>
          <TablePagination
            pagingState={{
              count,
              offset,
              title: "Sales Channels",
              pageSize: offset + table.rows.length,
              currentPage: table.state.pageIndex + 1,
              pageCount: table.pageCount,
              nextPage: handleNext,
              prevPage: handlePrev,
              hasNext: table.canNextPage,
              hasPrev: table.canPreviousPage,
            }}
            isLoading={isLoading}
          />
        </div>
      </>
    )
  }
)

export default PermissionsTable