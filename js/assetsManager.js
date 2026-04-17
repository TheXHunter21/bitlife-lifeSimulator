/**
 * AssetManager
 * Módulo para gestionar la tienda y las posesiones del jugador
 */
const AssetManager = (() => {
    let shops = {};
  
    const loadShops = async () => {
      try {
        const response = await fetch('data/shops.json');
        if (!response.ok) throw new Error(`Error cargando tiendas: ${response.status}`);
        shops = await response.json();
        console.log('Tiendas cargadas exitosamente');
      } catch (error) {
        console.error('Error en loadShops:', error);
      }
    };
  
    const getShops = () => shops;
  
    const buyItem = (player, item) => {
      if (player.money >= item.price) {
        player.money -= item.price;
        
        // 🛡️ PARCHE DE SEGURIDAD (AUTO-SANACIÓN): 
        // Si el jugador no tiene el inventario creado, lo creamos en este instante
        if (!player.assets) player.assets = {};
        if (!player.assets.vehicles) player.assets.vehicles = [];
        if (!player.assets.properties) player.assets.properties = [];
        if (!player.assets.possessions) player.assets.possessions = [];

        // Clasificamos el item en la categoría correcta
        // (Añadí "Vehiculo" sin tilde por si en el JSON lo escribes distinto alguna vez)
        if (item.type === "Vehículo" || item.type === "Vehiculo") {
            player.assets.vehicles.push(item);
        } else if (item.type === "Propiedad") {
            player.assets.properties.push(item);
        } else {
            player.assets.possessions.push(item);
        }
        
        return true;
      }
      return false; // No tiene suficiente dinero
    };
  
    return {
      loadShops,
      getShops,
      buyItem
    };
  })();