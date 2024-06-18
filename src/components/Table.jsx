import React from 'react'
import DataTable from 'react-data-table-component'

const Table = ({dataset}) => {

  //The columns values' adapt to the dataset attributes, if there's a nom attribute use it (like for green spaces), otherwise use the model attribute (like for fountains)
  const columns = [
    {
      name: 'Name',
      selector: row => row.nom ? row.nom: row.modele,
      sortable: true
    },
    {
      name: 'Address',
      selector: row => row.adresse ? row.adresse : row.voie
    },
    {
      name: 'Category',
      selector: row => row.type ? row.type : row.type_objet.substring(9).toLowerCase()
    }
  ];
  const data = dataset;
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        pagination
        fixedHeader>
      </DataTable>
    </div>
  )
}

export default Table

//Took me forever to build a data table alone and it didn't look good so yeah now credits to this reusable component: 
//https://react-data-table-component.netlify.app/?path=/docs/getting-started-patterns--docs