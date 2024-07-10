const list = [
  {
    name: '1',
    id: 1,
  },
  {
    name: '2',
    id: 2,
  },
  {
    name: '3',
    id: 3,
  },
  {
    name: '4',
    id: 4,
  },
  {
    name: '5',
    id: 5,
  },
  {
    name: '6',
    id: 6,
  },
];

export function getNavDataList() {
  return list;
}

export function addListData() {
  list.push({
    id: list.length,
    name: list.length,
  });
  return list;
}
