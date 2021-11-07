<template>
  <v-card
    class="mt-4 mx-auto"
    max-width="500"
  >
    <v-sheet
      class="v-sheet--offset mx-auto"
      color="cyan"
      elevation="12"
      max-width="calc(100% - 32px)"
    >
      <v-sparkline
        :labels="labels"
        :value="value"
        color="white"
        line-width="2"
        padding="16"
      ></v-sparkline>
    </v-sheet>

    <v-card-title>5% Confidence Interval: {{this.confidence_range}} </v-card-title>

  </v-card>
</template>

<script>
import firebaseApp from '../../firebase.js';
import { getFirestore } from "firebase/firestore";
import { collection, getDocs} from "firebase/firestore"

const db = getFirestore(firebaseApp);

export default {
data() {
    return {
        labels: new Array(),
        value: new Array(),
        sum: 0,
        mean: 0,
        sd: 0,
        confidence_range: new Array(),
        confidence_lvl: 0,
    }
},


props: {'id': Number},

mounted() {
    this.display(this.id)
},

methods: {
    async display(identifier) {
        var z  = await getDocs(collection(db, "ItemDisbursed"));
        var curr_labels = new Array()
        var curr_value = new Array()
            
        z.forEach((docs) => {
            let yy = docs.data()

            var id = yy.Item_Id
            var quant = yy.Order_Quantity
            var month = yy.Timestamp.slice(3, 5)
            var day = yy.Timestamp.slice(0,2)

            if (identifier == id) {
                var str = this.getDateString(day, parseInt(month))
                curr_labels = curr_labels.concat(str)
                curr_value = curr_value.concat(quant)
            }
        })
        this.labels = curr_labels
        this.value = curr_value

        var total = this.getSumSq(curr_value)
        this.total = total

        var sd = this.getSD (total, curr_value.length)
        this.sd = sd
        this.getConfidenceInterval(total, curr_value.length, sd)
    },

    getDateString(day , month) {
        month = parseInt(month)
        var str = ""
        if (month === 1) {
            let str2 = "Jan";
            str = str.concat(str2)
        }
        else if (month === 2) {
            let str2 = "Feb";
            str = str.concat(str2)
        }
        else if (month === 3) {
            let str2 = "Mar";
            str = str.concat(str2)
        }
        else if (month === 4) {
            let str2 = "Apr";
            str = str.concat(str2)
        }
        else if (month === 5) {
            let str2 = "May";
            str = str.concat(str2)
        }
        else if (month === 6) {
            let str2 = "Jun";
            str = str.concat(str2)
        }
        else if (month === 7) {
            let str2 = "Jul";
            str = str.concat(str2)
        }
        else if (month === 8) {
            let str2 = "Aug";
            str = str.concat(str2)
        }
        else if (month === 9) {
            let str2 = "Sep";
            str = str.concat(str2)
        }
        else if (month === 10) {
            let str2 = "Oct";
            str = str.concat(str2)
        }
        else if (month === 11) {
            let str2 = "Nov";
            str = str.concat(str2)
        }
        else {
            let str2 = "Dec";
            str = str.concat(str2)
        }
        str = str.concat(" " + day.toString())
        return str
    },

    getSumSq (dataset) {

        var i,
            total = 0;

        for (i = 0; i < dataset.length; i++) {

        total += parseInt(dataset[i]);
        }
        this.sum = total;
        return total
    },
    
    getSD (sum, sampleSize) {

        var sd = Math.sqrt(sum / sampleSize).toFixed(2);
    
        this.sd = sd
        return sd
    },

    getConfidenceInterval(sum, sampleSize, sd) {
  
        var formula = sd / Math.sqrt(sampleSize);

        var mean = sum/sampleSize
        
        var confidence_range = [(mean - formula).toFixed(0), (mean + formula).toFixed(0)];
        var confidence_lvl = (mean - confidence_range[0]).toFixed(0);

        this.confidence_range = confidence_range
        this.confidence_lvl = confidence_lvl

        return confidence_lvl
    }

}


}
</script>
