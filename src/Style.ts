import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  box: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#0000000d',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowBaseline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  bgWhite: {
    backgroundColor: 'white',
  },
  chatFrom: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: 300,
    elevation: 2,
    borderRadius: 10,
    backgroundColor: 'tomato',
    marginBottom: 15,
  },
  textWhite: {
    color: 'white',
  },
  chatTo: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    width: 300,
    elevation: 2,
    borderRadius: 10,
    backgroundColor: 'green',
    marginLeft: 'auto',
    marginBottom: 15,
  },
});

export default styles;
