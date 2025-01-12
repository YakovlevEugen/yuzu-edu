CREATE TABLE testnet_dapps (
    name      varchar(96),
    address   varchar,
    boost     numeric
);

CREATE TABLE testnet_transactions (
    hash      varchar(66),
    block     numeric,
    from      varchar(42),
    to        varchar(42)
);

CREATE VIEW testnet_tx_points_view AS
SELECT
    tx.from AS address,
    tx.hash AS hash,
    COALESCE(dapp.boost, 1) AS wallet_points,
    COALESCE(dapp.boost, 1) * 0.1 AS dapp_points,
    dapp.name AS dapp_name,
FROM
    testnet_transactions tx
WHERE
    tx.block >= 68862 AND
    tx.block <= 29593368
LEFT JOIN
    testnet_dapps dapp 
ON 
    tx.to = dapp.address;

CREATE VIEW eoas_testnet_points_view AS
SELECT 
    address as address,
    sum(wallet_points) as points
FROM
    testnet_tx_points_view
WHERE 
    dapp_name IS null
GROUP BY
  address;

CREATE VIEW dapps_testnet_points_view AS
SELECT 
    dapp_name AS name,
    sum(dapp_points) AS points
FROM
    testnet_tx_points_view
WHERE
    dapp_name IS NOT null
GROUP BY
  name;