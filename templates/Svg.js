/* eslint react/no-array-index-key:0 */
import React from 'react';
import PropTypes from 'prop-types';

const Svg = ({
  viewBox,
  pathList,
  ...other
}) => (
  <svg
    {...other}
    viewBox={viewBox}
  >
    {
      pathList.map((item, i) => (
        <path
          key={i}
          d={item}
        />
      ))
    }
  </svg>
);

Svg.propTypes = {
  viewBox: PropTypes.string.isRequired,
  pathList: PropTypes.array.isRequired,
};

export default Svg;
