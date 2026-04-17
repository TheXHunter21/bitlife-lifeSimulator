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
        
        // Clasificamos el item en la categoría correcta del inventario
        if (item.type === "Vehículo") player.assets.vehicles.push(item);
        else if (item.type === "Propiedad") player.assets.properties.push(item);
        else player.assets.possessions.push(item);
        
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